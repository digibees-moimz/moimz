from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DiaryCreate(BaseModel):
    group_id: int
    diary_text: str
    image_path: Optional[str] = None

class DiaryRead(BaseModel):
    id: int
    group_id: int
    diary_text: str
    image_path: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
