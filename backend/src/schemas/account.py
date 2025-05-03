# src/schemas/account.py

from pydantic import BaseModel, computed_field
from typing import List

# 계좌 생성 (유저 생성 시 내부적으로만 사용됨)
class AccountCreate(BaseModel):
    user_id: int
    account_name: str
    account_number: str
    balance: float = 0.0

class LockInSummary(BaseModel):
    group_id: int
    amount: float  # 합산된 금액만

    class Config:
        orm_mode = True

# 계좌 조회
class AccountRead(BaseModel):
    id: int
    user_id: int
    account_name: str
    account_number: str
    balance: float
    locked_balance: float
    lockins: List[LockInSummary]  # 새로 추가된 필드

    @computed_field
    def available_balance(self) -> float:
        return self.balance - self.locked_balance

    class Config:
        orm_mode = True

# 계좌 입출금 요청용
class DepositWithdrawRequest(BaseModel):
    user_id: int
    amount: float  # 음수면 출금, 양수면 입금
    description: str = ""

