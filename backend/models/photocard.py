from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from core.enums import CardStatus

class PhotocardDB(BaseModel):
    id: str
    user_id: Optional[str]
    template_id: str
    headline: str
    subheadline: str
    image_url: str
    storage_path: str
    status: CardStatus = CardStatus.COMPLETED
    created_at: datetime = datetime.now()
    metadata: Dict[str, Any] = {}

    class Config:
        from_attributes = True
