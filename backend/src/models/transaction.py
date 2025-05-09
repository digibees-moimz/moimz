# src/models/transaction.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int
    total_amount: float
    description: Optional[str] = None
    store_name: Optional[str] = Field(default=None, description="결제 가게 이름")
    mcc_code: Optional[int] = Field(default=None, description="결제 업종 코드")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    schedule_id: Optional[int] = Field(default=None, foreign_key="schedule.id")  # ✅ 추가

    # participants 관계 추가
    participants: List["TransactionParticipant"] = Relationship(back_populates="transaction")
    schedule: Optional["Schedule"] = Relationship(back_populates="transactions")  # ✅ 역방향

class TransactionParticipant(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    transaction_id: int = Field(foreign_key="transaction.id")
    user_id: int = Field(foreign_key="user.id")
    amount: float

    # 역방향 관계 설정
    transaction: Optional[Transaction] = Relationship(back_populates="participants")