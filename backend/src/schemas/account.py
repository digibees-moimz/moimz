from pydantic import BaseModel

class AccountCreate(BaseModel):
    user_id: int
    bank_name: str
    account_number: str
    balance: float = 0.0

class AccountRead(BaseModel):
    id: int
    user_id: int
    account_name: str
    account_number: str
    balance: float
