from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from src.schemas.user import UserPublic
from src.schemas.transaction import TransactionRead


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
    location: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AllScheduleCalendarRead(BaseModel):
    id: int
    title: str
    date: datetime
    is_done: bool
    group_id: int
    group_name: str
    location: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ScheduleCommentRead(BaseModel):
    id: int
    user: UserPublic
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ScheduleImageRead(BaseModel):
    id: int
    image_url: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ScheduleRead(BaseModel):
    id: int
    group_id: int
    diary_id: Optional[int] = None
    user: UserPublic
    title: str
    images: Optional[list[ScheduleImageRead]] = None
    date: datetime
    location: Optional[str]
    is_done: bool
    description: Optional[str]
    created_at: datetime
    comments: list[ScheduleCommentRead] = []
    transactions: list[TransactionRead] = []

    model_config = ConfigDict(from_attributes=True)


class ScheduleUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_done: Optional[bool] = None


class ScheduleCommentCreate(BaseModel):
    user_id: int
    content: str

class ScheduleImageCreate(BaseModel):
    schedule_id: int
    image_url: str

class PendingScheduleRead(BaseModel):
    id: int
    group_id: int
    title: str
    date: datetime
    is_done: bool
    location: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
