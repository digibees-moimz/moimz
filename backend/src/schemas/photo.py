# backend/src/schemas/photo.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PhotoCreate(BaseModel):
    group_id: int
    user_id: Optional[int]
    file_name: str


class PhotoRead(BaseModel):
    id: int
    group_id: int
    user_id: Optional[int]
    file_name: str
    uploaded_at: datetime
    face_processed: bool

    model_config = {"from_attributes": True}
