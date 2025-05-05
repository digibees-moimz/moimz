# src/models/board.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class Board(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    user_id: int = Field(foreign_key="user.id")
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # 양방향 관계 설정
    user: Optional["User"] = Relationship(back_populates="boards")
    group: Optional["Group"] = Relationship(back_populates="boards")