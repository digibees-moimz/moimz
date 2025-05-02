from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class GroupAccount(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    account_number: str = Field(..., unique=True, description="모임 계좌번호")

    group: Optional["Group"] = Relationship(back_populates="account")

class GroupTransaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_account_id: int = Field(foreign_key="groupaccount.id")
    user_account_id: Optional[int] = Field(default=None, foreign_key="useraccount.id")
    amount: float  # 양수면 입금, 음수면 출금
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LockIn(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_account_id: int = Field(foreign_key="useraccount.id")
    group_id: int = Field(foreign_key="group.id")
    amount: float
    description: str = Field(default="락인")  

    user_account: Optional["UserAccount"] = Relationship(back_populates="lockins")
    group: Optional["Group"] = Relationship(back_populates="lockins")