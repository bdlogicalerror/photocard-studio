from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import os
import time
from api.v1.api import api_router
from core.config import settings
from exceptions import AppException, app_exception_handler, global_exception_handler
from utils.logging import setup_logging, logger

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local storage for guest images
# This allows guests to see their images without Supabase
GUEST_STORAGE_PATH = "/tmp/photocards"
os.makedirs(GUEST_STORAGE_PATH, exist_ok=True)
app.mount("/api/v1/static", StaticFiles(directory=GUEST_STORAGE_PATH), name="static")

# Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Cleanup task for guest images (Older than 24 hours)
async def cleanup_guest_images():
    while True:
        try:
            logger.info("Running guest image cleanup...")
            now = time.time()
            # 24 hours in seconds
            retention = 24 * 3600 
            
            for f in os.listdir(GUEST_STORAGE_PATH):
                file_path = os.path.join(GUEST_STORAGE_PATH, f)
                if os.path.isfile(file_path):
                    if os.stat(file_path).st_mtime < now - retention:
                        os.remove(file_path)
                        logger.info(f"Deleted expired guest image: {f}")
        except Exception as e:
            logger.error(f"Cleanup error: {e}")
        
        # Run every hour
        await asyncio.sleep(3600)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(cleanup_guest_images())

@app.get("/")
async def root():
    return {"message": "Welcome to News Cards Studio API"}
