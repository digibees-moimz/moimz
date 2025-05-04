# backend/src/schemas/attendance.py
from pydantic import BaseModel, Field
from typing import List

# 사진 기반 출석체크
class AttendanceItem(BaseModel):
    user_id: int = Field(..., description="출석한 사용자 ID")
    name: str = Field(..., description="출석한 사용자 이름")
    locked_amount: float = Field(..., description="해당 사용자의 락인 금액")
    similarity: float = Field(..., description="얼굴 유사도 점수")


class AttendanceResponse(BaseModel):
    attendees: List[AttendanceItem] = Field(
        ..., description="출석자로 판정된 사용자 리스트"
    )
    count: int = Field(..., description="출석자로 판정된 총 인원 수")
    total_available_amount: float = Field(..., description="출석자의 총 락인 금액 합계")
    duration: float = Field(..., description="체크에 걸린 시간(초)")
    image_url: str = Field(..., description="박스와 이름이 표시된 출석 사진 조회 URL")


# 수동 출석체크
class ManualAttendanceRequest(BaseModel):
    group_id: int
    user_ids: List[int]


class ManualAttendanceItem(BaseModel):
    user_id: int
    name: str
    locked_amount: float


class ManualAttendanceResponse(BaseModel):
    attendees: List[ManualAttendanceItem]
    count: int
    total_available_amount: float
