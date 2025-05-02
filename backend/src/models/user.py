from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str

class UserAccount(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    account_name: str
    account_number: str
    balance: float = 0.0

    lockins: list["LockIn"] = Relationship(back_populates="user_account")


class LockIn(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_account_id: int = Field(foreign_key="useraccount.id")
    group_id: int = Field(foreign_key="group.id")
    amount: float
    description: str = Field(default="락인")  

    user_account: Optional["UserAccount"] = Relationship(back_populates="lockins")
    group: Optional["Group"] = Relationship(back_populates="lockins")