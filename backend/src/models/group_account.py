from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class GroupAccount(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    balance: float = 0.0  # 모임통장 잔액

class GroupTransaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_account_id: int = Field(foreign_key="groupaccount.id")
    user_account_id: Optional[int] = Field(default=None, foreign_key="useraccount.id")
    amount: float  # 양수면 입금, 음수면 출금
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
