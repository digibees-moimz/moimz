from pydantic import BaseModel
from typing import Optional

class GroupCreate(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None

class GroupRead(BaseModel):
    id: int
    name: str
    category: Optional[str]
    description: Optional[str]

class MemberCreate(BaseModel):
    user_id: int
    group_id: int
    role: Optional[str] = "MEMBER"
