# backend/src/schemas/attendance.py
from pydantic import BaseModel, Field
from typing import List


class AttendanceItem(BaseModel):
    user_id: int = Field(..., description="출석한 사용자 ID")
    similarity: float = Field(..., description="얼굴 유사도 점수")


class AttendanceResponse(BaseModel):
    attendees: List[AttendanceItem] = Field(
        ..., description="출석자로 판정된 사용자 리스트"
    )
    count: int = Field(..., description="출석자로 판정된 총 인원 수")
    duration: float = Field(..., description="체크에 걸린 시간(초)")
