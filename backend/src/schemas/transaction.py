# src/schemas/transaction.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from src.schemas.user import UserPublic  # name, profile_image_url 포함된 경량 유저 정보 스키마

# class ParticipantOut(BaseModel):
#     user_id: int
#     amount: float

#     class Config:
#         from_attributes = True

class TransactionParticipantRead(BaseModel):
    user_id: int
    amount: float
    user: UserPublic  # ✅ 유저 정보 포함

    class Config:
        from_attributes = True

class TransactionRead(BaseModel):
    id: int
    group_id: int
    total_amount: float
    schedule_id: int | None
    store_name: Optional[str] = None  # 이거 DB에서 직접 넣을게요
    store_location: Optional[str] = None
    mcc_code: Optional[int] = None
    description: str
    created_at: datetime
    participants: List[TransactionParticipantRead]

    class Config:
        from_attributes = True
