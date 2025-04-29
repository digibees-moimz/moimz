from sqlmodel import SQLModel, Field
from typing import Optional

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    user_id: int = Field(foreign_key="user.id")
    amount: float  # 개인별 N등분 금액
    total_amount: float  # 전체 결제 금액
    description: Optional[str] = None
