# src/schemas/transaction.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ParticipantOut(BaseModel):
    user_id: int
    amount: float

    class Config:
        from_attributes = True

class TransactionRead(BaseModel):
    id: int
    group_id: int
    total_amount: float
    schedule_id: int | None 
    store_name: Optional[str] = None # 이거 DB에서 직접 넣을게요
    mcc_code: Optional[int] = None   
    description: str
    created_at: datetime
    participants: List[ParticipantOut]

    class Config:
        from_attributes = True 
