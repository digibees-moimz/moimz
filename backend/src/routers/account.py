from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.user import UserAccount
from src.schemas.account import AccountCreate, AccountRead

router = APIRouter()

@router.post("/accounts", response_model=AccountRead, status_code=status.HTTP_201_CREATED)
def create_account(account: AccountCreate):
    with Session(engine) as session:
        new_account = UserAccount(**account.dict())
        session.add(new_account)
        session.commit()
        session.refresh(new_account)
        return new_account

@router.get("/accounts", response_model=list[AccountRead])
def get_all_accounts():
    with Session(engine) as session:
        accounts = session.exec(select(UserAccount)).all()
        return accounts
