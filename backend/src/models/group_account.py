# src/models/group_account.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class GroupAccount(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    account_number: str = Field(..., unique=True, description="모임 계좌번호")

    # 양방향 관계 설정
    group: Optional["Group"] = Relationship(back_populates="account")
    lockins: List["LockIn"] = Relationship(back_populates="group_account")
    transactions: List["GroupTransaction"] = Relationship(back_populates="group_account")

class GroupTransaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_account_id: int = Field(foreign_key="groupaccount.id")
    user_account_id: Optional[int] = Field(default=None, foreign_key="useraccount.id")
    amount: float
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # 양방향 관계 설정
    group_account: Optional["GroupAccount"] = Relationship(back_populates="transactions")
    user_account: Optional["UserAccount"] = Relationship(back_populates="group_transactions")

class LockIn(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_account_id: int = Field(foreign_key="useraccount.id")
    group_account_id: int = Field(foreign_key="groupaccount.id")
    amount: float
    description: str = Field(default="락인")  

    # 양방향 관계 설정
    user_account: Optional["UserAccount"] = Relationship(back_populates="lockins")
    group_account: Optional["GroupAccount"] = Relationship(back_populates="lockins")