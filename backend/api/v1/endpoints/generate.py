from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional, List
import json
import os
import base64
from io import BytesIO
import uuid
from datetime import datetime
from PIL import Image

from services.renderer import renderer
from services.storage import storage_service
from services.shield import shield_service
from services.branding import branding_service
from schemas.photocard import PhotocardCreate, PhotocardResponse
from exceptions import NotFoundException, AppException
from utils.logging import logger

router = APIRouter()

# Guest Download Limit tracking
GUEST_LIMIT = int(os.environ.get("GUEST_DOWNLOAD_LIMIT", 5))
guest_usage = {} # ip: count

@router.post("/", response_model=PhotocardResponse)
async def generate_photocard(request: PhotocardCreate, fastapi_request: Request):
    # 0. Check Guest Limit
    client_ip = fastapi_request.client.host
    is_guest = not fastapi_request.headers.get("Authorization")
    
    if is_guest:
        current_count = guest_usage.get(client_ip, 0)
        logger.info(f"Guest Request from {client_ip}. Current count: {current_count}/{GUEST_LIMIT}")
        if current_count >= GUEST_LIMIT:
            raise HTTPException(status_code=429, detail="Guest download limit reached. Please sign in.")
        guest_usage[client_ip] = current_count + 1

    try:
        logger.info("--- Photocard Generation Pipeline Started ---")
        
        # 1. Get Visual Content
        if request.base64_image:
            logger.info("Using frontend-provided visual data")
            header, encoded = request.base64_image.split(",", 1) if "," in request.base64_image else (None, request.base64_image)
            image_data = base64.b64decode(encoded)
            image = Image.open(BytesIO(image_data)).convert("RGB")
        else:
            logger.info("Rendering on backend (Fallback)")
            # ... (rendering logic same as before if needed)
            image = await renderer.render_card({}, {}) 

        # 2. Apply Mandatory Branding for Guests
        if is_guest:
            image = branding_service.apply_guest_branding(image)

        # 3. Apply Authenticity Shield (Invisible)
        shield_id = str(uuid.uuid4())[:16]
        image = shield_service.embed_shield(image, shield_id)
        
        # 4. Final Processing & Buffer
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format='PNG', optimize=True)
        img_byte_arr.seek(0)
        
        # 5. Upload & Storage
        filename = f"card_{uuid.uuid4().hex[:10]}_{datetime.now().strftime('%Y%m%d%H%M')}.png"
        base_url = str(fastapi_request.base_url).rstrip("/")
        public_url = await storage_service.upload_image(img_byte_arr, filename, is_guest=is_guest)
        
        # Format public URL for static serving
        if public_url.startswith("/api/v1/static/"):
            public_url = f"{base_url}{public_url}"

        if not public_url:
            raise AppException("Failed to store image")
            
        logger.info(f"Generation successful: {public_url}")
            
        return PhotocardResponse(
            id=str(uuid.uuid4()),
            image_url=public_url,
            status="completed",
            filename=filename
        )
    except Exception as e:
        logger.exception(f"Generation failed: {str(e)}")
        raise AppException(f"Internal Error: {str(e)}")
