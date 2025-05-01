# schemas/transaction.py
from pydantic import BaseModel
from typing import List
from datetime import datetime

class ParticipantOut(BaseModel):
    user_id: int
    amount: float

    class Config:
        orm_mode = True

class TransactionRead(BaseModel):
    id: int
    group_id: int
    total_amount: float
    description: str
    created_at: datetime
    participants: List[ParticipantOut] # 관계 필드

    class Config:
        orm_mode = True
