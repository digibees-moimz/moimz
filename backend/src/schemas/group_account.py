from pydantic import BaseModel
from typing import List

class MemberLockedAmount(BaseModel):
    user_account_id: int
    locked_amount: float

    class Config:
        orm_mode = True # ✅ orm_mode = True는 DB에서 가져온 데이터 그대로 변환 가능하게 해줌

class GroupAccountSummary(BaseModel):
    group_account_id: int
    total_balance: float
    members: List[MemberLockedAmount]

    class Config:
        orm_mode = True

class LockInCreate(BaseModel):
    group_id: int
    user_id: int         # 누가 락인했는지
    amount: float        # 락인 금액 (양수)
    description: str

class SpendCreate(BaseModel):
    group_id: int
    user_ids: List[int]  # 출석자
    total_amount: float  # 전체 지출 금액
    description: str