from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str  # 이메일은 회원 식별용
    balance: float = 0.0  # 모임 통장 내 사용자 가상 잔액

class UserAccount(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    bank_name: str  # 카카오뱅크, 신한은행 같은 진짜 은행 이름
    account_number: str
    balance: float = 0.0  # 개인 계좌 잔액
