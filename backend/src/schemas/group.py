# src/schemas/group.py

from pydantic import BaseModel
from typing import Optional

class GroupCreate(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = "/images/groups/default.png"

class GroupRead(BaseModel):
    id: int
    name: str
    category: Optional[str]
    description: Optional[str]
    image_url: Optional[str]

class GroupJoin(BaseModel):
    user_id: int
    group_id: int
    role: Optional[str] = "MEMBER"

class GroupLeave(BaseModel):
    user_id: int
    group_id: int

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

# User가 보는 개인 모임 정보 요약, 메인에 해당유저 가입된 모임 다 가져오려고 쓰는거
class UserGroupSummary(BaseModel):
    id: int
    name: str
    category: str | None = None
    image_url: str | None = None
    account_number: str | None = None
    locked_amount: float = 0.0
    group_balance: float = 0.0
    member_count: int = 0
    
    class Config:
        orm_mode = True
