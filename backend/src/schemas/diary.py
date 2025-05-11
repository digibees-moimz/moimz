from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AttendeeInfo(BaseModel):
    user_id: int
    name: str
    profile_image_url: Optional[str] = None


class DiaryCreate(BaseModel):
    group_id: int
    user_id: Optional[int] = None  # 유저 정보도 저장
    schedule_id: Optional[int] = None
    attendance_id: Optional[int] = None
    diary_text: str
    image_path: Optional[str] = None


class DiaryRead(BaseModel):
    id: int
    group_id: int
    user_id: int
    schedule_id: Optional[int]
    attendance_id: Optional[int]
    title: str
    diary_text: str
    summary: Optional[str] = None
    image_path: Optional[str]
    created_at: datetime

    hashtags: Optional[str] = None
    attendees: List[AttendeeInfo] = []

    class Config:
        from_attributes = True
