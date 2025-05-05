# backend/src/schemas/attendance.py
from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class BaseAttendanceItem(BaseModel):
    user_id: int = Field(..., description="출석한 사용자 ID")
    name: str = Field(..., description="출석한 사용자 이름")
    locked_amount: float = Field(..., description="해당 사용자의 락인 금액")


class PhotoAttendanceItem(BaseAttendanceItem):
    similarity: float = Field(..., description="얼굴 유사도 점수")


class ManualAttendanceItem(BaseAttendanceItem):
    pass


class BaseAttendanceResponse(BaseModel):
    group_id: int = Field(..., description="출석이 발생한 그룹 ID")
    user_ids: List[int] = Field(..., description="출석한 사용자 ID 리스트")
    available_to_spend: float = Field(..., description="락인 기준 지출 가능 최대 금액")
    count: int = Field(..., description="출석자로 판정된 총 인원 수")


class PhotoAttendanceResponse(BaseAttendanceResponse):
    duration: float = Field(..., description="체크에 걸린 시간(초)")
    image_url: str = Field(..., description="박스와 이름이 표시된 출석 사진 조회 URL")
    attendees: List[PhotoAttendanceItem]  # 유사도 포함
    check_type: Literal["photo"] = Field(default="photo", description="출석체크 방식")


class ManualAttendanceResponse(BaseAttendanceResponse):
    attendees: List[ManualAttendanceItem]  # 유사도 없음
    check_type: Literal["manual"] = Field(default="manual", description="출석체크 방식")


class ManualAttendanceRequest(BaseModel):
    group_id: int
    user_ids: List[int]


# 출석 완료 시 정보 저장
class AttendanceCompleteRequest(BaseModel):
    group_id: int
    schedule_id: Optional[int] = None
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


class AttendanceUpdateRequest(BaseModel):
    user_ids: List[int] = Field(..., description="수정된 참석자 ID 리스트")
