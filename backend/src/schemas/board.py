from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BoardCreate(BaseModel):
    group_id: int
    user_id: int
    title: str
    content: str

class BoardRead(BaseModel):
    id: int
    group_id: int
    user_id: int
    title: str
    content: str
    created_at: datetime

    class Config:
        orm_mode = True
