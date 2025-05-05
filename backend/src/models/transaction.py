# src/models/transaction.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int
    total_amount: float
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # participants 관계 추가
    participants: List["TransactionParticipant"] = Relationship(back_populates="transaction")

class TransactionParticipant(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    transaction_id: int = Field(foreign_key="transaction.id")
    user_id: int = Field(foreign_key="user.id")
    amount: float

    # 역방향 관계 설정
    transaction: Optional[Transaction] = Relationship(back_populates="participants")