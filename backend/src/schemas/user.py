from pydantic import BaseModel
from typing import List
from src.schemas.account import AccountRead

class UserCreate(BaseModel):
    name: str
    email: str           # 유효 이메일 자동 검증
    account_name: str 
    account_number: str     # ← 계좌용 필드 추가

class UserRead(BaseModel):
    id: int
    name: str
    email: str
    
class UserDetail(BaseModel):
    id: int
    name: str
    email: str
    account: AccountRead | None = None  # ✅ 단일 계좌
