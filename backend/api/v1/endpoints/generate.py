from fastapi import APIRouter, HTTPException, Depends, Request, File, UploadFile, Form
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
from services.queue import queue_service
from schemas.photocard import PhotocardCreate, PhotocardResponse
from exceptions import NotFoundException, AppException
from utils.logging import logger

router = APIRouter()

# Guest Download Limit tracking
GUEST_LIMIT = int(os.environ.get("GUEST_DOWNLOAD_LIMIT", 5))
guest_usage = {} # ip: count

@router.post("/", response_model=PhotocardResponse)
async def generate_photocard(
    fastapi_request: Request,
    image_file: Optional[UploadFile] = File(None),
    template_id: str = Form(...),
    headline: str = Form(...),
    subheadline: str = Form(""),
    variant: str = Form("square"),
    brand_name: str = Form("News Cards Studio"),
    photos_json: str = Form("[]"),
    style_overrides_json: str = Form("{}"),
    quality: str = Form("standard")
):
    # 0. Check Guest Limit
    client_ip = fastapi_request.client.host
    is_guest = not fastapi_request.headers.get("Authorization")
    
    if is_guest:
        from services.photocard import photocard_service
        current_count = await photocard_service.check_and_log_guest_usage(client_ip, GUEST_LIMIT)
        logger.info(f"Guest Request from {client_ip}. Current count: {current_count}/{GUEST_LIMIT}")
        if current_count >= GUEST_LIMIT:
            raise HTTPException(status_code=429, detail="Guest download limit reached. Please sign in.")

    try:
        logger.info("--- Photocard Generation Pipeline Started ---")
        # Pass payload to the background queue worker
        payload = {
            "template_id": template_id,
            "headline": headline,
            "subheadline": subheadline,
            "variant": variant,
            "quality": quality,
            "brand_name": brand_name,
            "photos": json.loads(photos_json)
        }
        
        job_id = str(uuid.uuid4())
        user_id = fastapi_request.headers.get("X-User-ID")
        
        # Enqueue the job using arq
        await queue_service.enqueue_job(
            "generate_photocard_task",
            job_id,
            template_id,
            payload,
            is_guest,
            user_id,
            client_ip,
            _job_id=job_id
        )
        
        logger.info(f"Generation job {job_id} enqueued")
            
        return PhotocardResponse(
            id=job_id,
            image_url="", # Will be available later
            status="processing",
            filename="",
            shield_id=""
        )
    except Exception as e:
        logger.exception(f"Generation failed: {str(e)}")
        raise AppException(f"Internal Error: {str(e)}")

@router.get("/status/{job_id}")
async def get_generation_status(job_id: str):
    try:
        job_data = await queue_service.get_job_status(job_id)
        if not job_data:
            # Check if it was just enqueued
            return {
                "job_id": job_id,
                "status": "queued",
                "progress": 0,
                "message": "Enqueued",
                "result": None
            }
            
        # Job status can be 'queued', 'in-progress', 'complete', 'not-found', etc.
        pool = await queue_service.get_pool()
        progress_data = await pool.get(f"job_progress:{job_id}")
            
        progress = 0
        message = "Processing"
        if progress_data:
            try:
                data = json.loads(progress_data)
                progress = data.get("progress", 0)
                message = data.get("status", message)
            except Exception:
                pass
            
        if job_data["status"] == "complete":
            progress = 100
            message = "Done"
        elif job_data["status"] == "failed":
            progress = -1
            message = "Failed to generate"
            
        return {
            "job_id": job_id,
            "status": job_data["status"],
            "progress": progress,
            "message": message,
            "result": job_data["result"]
        }
    except Exception as e:
        logger.error(f"Status check failed for {job_id}: {str(e)}")
        return {
            "job_id": job_id,
            "status": "error",
            "progress": -1,
            "message": f"Server Error: {str(e)}",
            "result": None
        }
