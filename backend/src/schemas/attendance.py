# backend/src/schemas/attendance.py
from pydantic import BaseModel, Field
from typing import List, Optional


class BaseAttendanceItem(BaseModel):
    user_id: int = Field(..., description="출석한 사용자 ID")
    name: str = Field(..., description="출석한 사용자 이름")
    locked_amount: float = Field(..., description="해당 사용자의 락인 금액")


# 사진 기반 출석체크
class AttendanceItem(BaseAttendanceItem):
    similarity: float = Field(..., description="얼굴 유사도 점수")


class AttendanceResponse(BaseModel):
    attendees: List[AttendanceItem] = Field(
        ..., description="출석자로 판정된 사용자 리스트"
    )
    count: int = Field(..., description="출석자로 판정된 총 인원 수")
    available_to_spend: float = Field(
        ..., description="참석자 기준 1/N 가능한 최대 지출 금액"
    )
    duration: float = Field(..., description="체크에 걸린 시간(초)")
    image_url: str = Field(..., description="박스와 이름이 표시된 출석 사진 조회 URL")


# 수동 출석체크
class ManualAttendanceRequest(BaseModel):
    group_id: int
    user_ids: List[int]


class ManualAttendanceItem(BaseAttendanceItem):
    pass


class ManualAttendanceResponse(BaseModel):
    attendees: List[ManualAttendanceItem]
    count: int
    available_to_spend: float = Field(
        ..., description="참석자 기준 1/N 가능한 최대 지출 금액"
    )


# 출석 완료 시 정보 저장
class AttendanceCompleteRequest(BaseModel):
    group_id: int
    user_ids: List[int]
    check_type: str  # "photo" 또는 "manual"
    image_url: Optional[str] = None


class SavedAttendanceItem(BaseModel):
    user_id: int
    name: str
    locked_amount: float


class AttendanceRecordRead(BaseModel):
    attendance_id: int
    attendees: List[SavedAttendanceItem]
    count: int
    available_to_spend: float
    check_type: str
    image_url: Optional[str] = None
