from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventCreate(BaseModel):
    group_id: int
    title: str
    description: Optional[str] = None
    event_datetime: datetime
    location: Optional[str] = None

class EventRead(BaseModel):
    id: int
    group_id: int
    title: str
    description: Optional[str]
    event_datetime: datetime
    location: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
