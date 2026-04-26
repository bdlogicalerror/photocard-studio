from fastapi import APIRouter, HTTPException, Depends, Request
from schemas.photocard import PhotocardSave
from services.photocard import photocard_service
from utils.logging import logger

router = APIRouter()

@router.post("/save")
async def save_photocard(request: PhotocardSave, fastapi_request: Request):
    # In a real SaaS, we would verify the JWT here.
    # For now, we take user_id from header (passed from frontend auth session)
    user_id = fastapi_request.headers.get("X-User-ID")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")
        
    try:
        logger.info(f"Saving photocard for user {user_id}: {request.filename}")
        result = await photocard_service.save_to_db({
            "user_id": user_id,
            "filename": request.filename,
            "template_id": request.template_id,
            "headline": request.headline,
            "card_data": request.card_data,
            "shield_id": request.shield_id
        })
        return result
    except Exception as e:
        logger.error(f"Save to DB failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
