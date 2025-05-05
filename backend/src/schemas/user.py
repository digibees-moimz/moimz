# src/schemas/user.py
from pydantic import BaseModel, ConfigDict
from typing import List
from src.schemas.account import AccountRead

class UserPublic(BaseModel):
    id: int
    name: str
    profile_image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    name: str
    email: str           # 유효 이메일 자동 검증
    account_name: str 
    account_number: str     # 계좌용 필드 추가

class UserRead(BaseModel):
    id: int
    name: str
    email: str
    profile_image_url: str | None = None 

class UserDetail(BaseModel):
    id: int
    name: str
    email: str
    profile_image_url: str | None = None 
    account: AccountRead | None = None  # 단일 계좌

    model_config = ConfigDict(from_attributes=True)