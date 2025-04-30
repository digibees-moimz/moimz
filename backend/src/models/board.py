from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Board(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    user_id: int = Field(foreign_key="useraccount.id")
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
