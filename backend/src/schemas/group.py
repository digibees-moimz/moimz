from pydantic import BaseModel
from typing import Optional

class GroupCreate(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = "/group-images/default.png"

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