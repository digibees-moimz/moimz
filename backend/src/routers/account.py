from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.user import UserAccount
from src.schemas.account import DepositWithdrawRequest

router = APIRouter(prefix="/accounts", tags=["Accounts"])

@router.post(
    "/transaction",
    status_code=status.HTTP_200_OK,
    summary="입출금 처리",
    description="사용자 계좌에 입금(양수) 또는 출금(음수)을 처리합니다.",
)
def update_account_balance(data: DepositWithdrawRequest):
    with Session(engine) as session:
        account = session.exec(
            select(UserAccount).where(UserAccount.user_id == data.user_id)
        ).first()

        if not account:
            raise HTTPException(404, detail="UserAccount not found")

        # 출금 시 잔액 확인
        if data.amount < 0 and account.balance + data.amount < 0:
            raise HTTPException(400, detail="잔액 부족으로 출금할 수 없습니다.")

        account.balance += data.amount
        session.commit()
        session.refresh(account)

        return {
            "user_account_id": account.id,
            "new_balance": account.balance,
            "description": data.description or ("입금" if data.amount > 0 else "출금"),
        }
