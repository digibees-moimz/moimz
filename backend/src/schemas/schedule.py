from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScheduleCreate(BaseModel):
    group_id: int
    title: str
    date: datetime
    location: Optional[str] = None
    description: Optional[str] = None

class ScheduleRead(BaseModel):
    id: int
    group_id: int
    title: str
    date: datetime
    location: Optional[str]
    is_done: bool
    description: Optional[str]

class ScheduleUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_done: Optional[bool] = None