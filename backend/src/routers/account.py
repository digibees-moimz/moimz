from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.user import UserAccount
from src.schemas.account import AccountCreate, AccountRead

router = APIRouter(prefix="/accounts", tags=["Accounts"])

@router.post(
    "",
    response_model=AccountRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create Account",
    description="새로운 사용자 계좌(UserAccount)를 생성합니다.",
)
def create_account(account: AccountCreate):
    with Session(engine) as session:
        new_account = UserAccount(**account.dict())
        session.add(new_account)
        session.commit()
        session.refresh(new_account)
        return new_account

@router.get(
    "",
    response_model=list[AccountRead],
    summary="Get All Accounts",
    description="모든 사용자 계좌 목록을 조회합니다.",
)
def get_all_accounts():
    with Session(engine) as session:
        accounts = session.exec(select(UserAccount)).all()
        return accounts
