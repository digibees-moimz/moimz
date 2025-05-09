from pydantic import BaseModel
from typing import List, Optional

class SpendCreate(BaseModel):
    group_id: int
    schedule_id: Optional[int] = None  # ← ✅ 추가: 어느 일정에 해당하는 지출인지
    user_ids: List[int]  # 출석자
    total_amount: float  # 전체 지출 금액
    description: str
    
class SpendByTokenRequest(BaseModel):
    total_amount: float
    schedule_id: Optional[int] = None  # ← ✅ 추가
    description: Optional[str] = None
