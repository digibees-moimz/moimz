from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Diary(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    diary_text: str
    image_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
