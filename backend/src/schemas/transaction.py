from pydantic import BaseModel
from typing import List

class TransactionCreate(BaseModel):
    group_id: int
    user_ids: List[int]
    total_amount: float
    description: str

class TransactionRead(BaseModel):
    id: int
    group_id: int
    user_id: int
    amount: float
    total_amount: float
    description: str
