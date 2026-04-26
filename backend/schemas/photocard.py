from pydantic import BaseModel, Field
from typing import Optional, List

class PhotoData(BaseModel):
    id: str
    src: str
    objectPosition: Optional[str] = "center"
    objectFit: Optional[str] = "cover"
    scale: Optional[float] = 1.0

class StyleOverrides(BaseModel):
    backgroundColor: Optional[str] = None
    accentColor: Optional[str] = None
    headlineColor: Optional[str] = None

class PhotocardCreate(BaseModel):
    template_id: str
    headline: str
    subheadline: Optional[str] = ""
    brand_name: Optional[str] = "News Cards Studio"
    photos: List[PhotoData]
    style_overrides: Optional[StyleOverrides] = None
    # NEW: Capture the visual data from the frontend
    base64_image: Optional[str] = None 

class PhotocardResponse(BaseModel):
    id: str
    image_url: str
    status: str
    filename: str
