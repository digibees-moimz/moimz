from pydantic import BaseModel, computed_field

# 계좌 생성 (유저 생성 시 내부적으로만 사용됨)
class AccountCreate(BaseModel):
    user_id: int
    account_name: str
    account_number: str
    balance: float = 0.0

# 계좌 조회
class AccountRead(BaseModel):
    id: int
    user_id: int
    account_name: str
    account_number: str
    balance: float
    locked_balance: float

    @computed_field
    def available_balance(self) -> float:
        return self.balance - self.locked_balance

# 계좌 입출금 요청용
class DepositWithdrawRequest(BaseModel):
    user_id: int
    amount: float  # 음수면 출금, 양수면 입금
    description: str = ""
