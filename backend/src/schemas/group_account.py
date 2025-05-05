# src/schemas/group_account.py

from pydantic import BaseModel, computed_field
from typing import List

class MemberLockedAmount(BaseModel):
    user_account_id: int
    name: str
    locked_amount: float

    class Config:
        orm_mode = True # orm_mode = True는 DB에서 가져온 데이터 그대로 변환 가능하게 해줌

class GroupAccountSummary(BaseModel):
    group_account_id: int
    account_number:str
    total_balance: float
    members: List[MemberLockedAmount]
    available_to_spend: float

    class Config:
        orm_mode = True

class LockInCreate(BaseModel):
    group_account_id: int
    user_id: int         # 누가 락인했는지
    amount: float        # 락인 금액 (양수)
    description: str = "락인"

class LockOutCreate(BaseModel):
    group_account_id: int  
    user_id: int
    amount: float
    description: str = "락인 해제"
