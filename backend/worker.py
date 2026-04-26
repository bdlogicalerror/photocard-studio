import asyncio
import os
import json
import uuid
from datetime import datetime
from io import BytesIO
from PIL import Image

from arq import create_pool
from arq.connections import RedisSettings
from playwright.async_api import async_playwright

from services.shield import shield_service
from services.branding import branding_service
from services.storage import storage_service
from services.photocard import photocard_service
from utils.logging import logger

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CHROME_WS_URL = os.getenv("CHROME_WS_URL", "ws://localhost:9222")
FRONTEND_URL = os.getenv("FRONTEND_INTERNAL_URL", "http://frontend:3003")

# Extract host/port from REDIS_URL for arq
redis_host = REDIS_URL.split("://")[1].split(":")[0]
redis_port = int(REDIS_URL.split("://")[1].split(":")[1]) if ":" in REDIS_URL.split("://")[1] else 6379

async def set_progress(ctx, job_id: str, status: str, progress: int):
    redis = ctx['redis']
    await redis.setex(f"job_progress:{job_id}", 3600, json.dumps({"status": status, "progress": progress}))

async def generate_photocard_task(ctx, job_id: str, template_id: str, payload: dict, is_guest: bool, user_id: str = None, client_ip: str = None):
    try:
        await set_progress(ctx, job_id, "Initializing Browser", 10)
        
        async with async_playwright() as p:
            logger.info(f"Connecting to remote browser at {CHROME_WS_URL}")
            # Retry connection up to 3 times
            browser = None
            for i in range(3):
                try:
                    browser = await p.chromium.connect_over_cdp(CHROME_WS_URL)
                    break
                except Exception as e:
                    if i == 2: raise e
                    logger.warning(f"Browser connection attempt {i+1} failed, retrying in 2s...")
                    await asyncio.sleep(2)
            
            # Determine base viewport (1080p width base for standard)
            variant = payload.get("variant", "square")
            base_dimensions = {
                "square": {"width": 1080, "height": 1080},
                "portrait": {"width": 1080, "height": 1920},
                "landscape": {"width": 1200, "height": 630},
            }
            viewport = base_dimensions.get(variant, {"width": 1080, "height": 1080})
            
            # Map quality to scale factor
            quality = payload.get("quality", "standard")
            scale_factors = {
                "standard": 1.0, # 1080p
                "hd": 1.5,       # 1620p
                "fhd": 2.0       # 2160p
            }
            device_scale_factor = scale_factors.get(quality, 1.0)
            
            # Create a new context and page
            context = await browser.new_context(
                viewport=viewport,
                device_scale_factor=device_scale_factor
            )
            page = await context.new_page()
            
            await set_progress(ctx, job_id, "Rendering UI Layout", 30)
            
            # Construct the internal render URL
            # We pass data via POST or evaluate it on the page. Since it's a headless browser, 
            # we can navigate to the render route and then inject the state.
            render_url = f"{FRONTEND_URL}/render"
            await page.goto(render_url)
            
            # Inject the payload into the window object so the React app can read it
            await page.evaluate(f"window.__INJECTED_CARD_DATA__ = {json.dumps(payload)};")
            
            # Trigger a re-render or wait for a specific selector that indicates the render is complete
            # We can dispatch an event
            await page.evaluate("window.dispatchEvent(new Event('render-data-ready'));")
            
            # Wait for all network requests (images) to finish and a special element to be ready
            await page.wait_for_selector("[data-render-complete='true']", timeout=15000)
            
            await set_progress(ctx, job_id, "Capturing High-Res Screenshot", 60)
            
            # Take screenshot of the exact card bounding box
            card_element = await page.query_selector("[data-card-preview]")
            screenshot_bytes = await card_element.screenshot(type="png")
            
            await context.close()
            await browser.close()
            
        await set_progress(ctx, job_id, "Applying Authenticity Shield", 75)
        
        # Open with Pillow for final branding/shield
        image = Image.open(BytesIO(screenshot_bytes)).convert("RGB")
        
        if is_guest:
            image = branding_service.apply_guest_branding(image)
            
        shield_id = str(uuid.uuid4())[:16]
        image = shield_service.embed_shield(image, shield_id)
        
        await set_progress(ctx, job_id, "Uploading File", 85)
        
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format='PNG', optimize=True)
        img_byte_arr.seek(0)
        
        filename = f"card_{uuid.uuid4().hex[:10]}_{datetime.now().strftime('%Y%m%d%H%M')}.png"
        public_url = await storage_service.upload_image(img_byte_arr, filename, is_guest=is_guest)
        
        # Save to DB
        await photocard_service.save_to_db({
            "image_url": public_url,
            "filename": filename,
            "template_id": template_id,
            "shield_id": shield_id,
            "headline": payload.get("headline", ""),
            "user_id": user_id,
            "guest_ip": client_ip,
            "is_guest": is_guest
        })
        
        await set_progress(ctx, job_id, "Done", 100)
        
        return {
            "success": True,
            "image_url": public_url,
            "filename": filename
        }
        
    except Exception as e:
        logger.error(f"Task failed: {str(e)}")
        await set_progress(ctx, job_id, f"Error: {str(e)}", -1)
        raise e

async def startup(ctx):
    logger.info("Worker starting up...")

async def shutdown(ctx):
    logger.info("Worker shutting down...")

class WorkerSettings:
    functions = [generate_photocard_task]
    redis_settings = RedisSettings(host=redis_host, port=redis_port)
    on_startup = startup
    on_shutdown = shutdown
