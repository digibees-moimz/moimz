from pydantic import BaseModel
from typing import List, Optional

class SpendCreate(BaseModel):
    group_id: int
    user_ids: List[int]  # 출석자
    total_amount: float  # 전체 지출 금액
    description: str
    
class SpendByTokenRequest(BaseModel):
    total_amount: float
    description: Optional[str] = None
