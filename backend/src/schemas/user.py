from pydantic import BaseModel
from typing import List
from src.schemas.account import AccountRead

class UserCreate(BaseModel):
    name: str
    email: str           # 유효 이메일 자동 검증
    balance: float = 0        # 초기 가상 잔액(옵션)

class UserRead(BaseModel):
    id: int
    name: str
    email: str
    balance: float
    
class UserDetail(BaseModel):
    id: int
    name: str
    email: str
    balance: float
    accounts: List[AccountRead] = []  # 유저가 가진 계좌 리스트