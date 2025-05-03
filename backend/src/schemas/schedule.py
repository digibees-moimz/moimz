from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScheduleCreate(BaseModel):
    group_id: int
    user_id: int
    title: str
    date: datetime
    location: Optional[str] = None
    description: Optional[str] = None

class ScheduleCalendarRead(BaseModel):
    id: int
    title: str
    date: datetime
    is_done: bool

    class Config:
        from_attributes = True

class ScheduleCommentRead(BaseModel):
    id: int
    user_id: int
    content: str
    created_at: datetime

    class Config:
        orm_mode = True


class ScheduleRead(BaseModel):
    id: int
    group_id: int
    user_id: int
    title: str
    date: datetime
    location: Optional[str]
    is_done: bool
    description: Optional[str]
    comments: list[ScheduleCommentRead] = []

    class Config:
        from_attributes = True  # 이거 꼭 있어야 ORM 관계도 반영

class ScheduleUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_done: Optional[bool] = None


class ScheduleCommentCreate(BaseModel):
    user_id: int
    content: str

