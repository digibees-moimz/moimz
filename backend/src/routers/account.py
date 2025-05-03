# src/routers/account.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.core.database import get_session
from src.models.user import UserAccount
from src.schemas.account import DepositWithdrawRequest
from src.routers._helpers import get_user_account

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.post(
    "/transaction",
    status_code=status.HTTP_200_OK,
    summary="입출금 처리",
    description="사용자 계좌에 입금(양수) 또는 출금(음수)을 처리합니다.",
)
def update_balance(dto: DepositWithdrawRequest, session: Session = Depends(get_session)):
    ua = get_user_account(session, dto.user_id)

    if dto.amount < 0 and ua.balance + dto.amount < 0:
        raise HTTPException(400, "잔액 부족으로 출금할 수 없습니다.")

    ua.balance += dto.amount
    session.commit()

    return {
        "user_account_id": ua.id,
        "new_balance": ua.balance,
        "description": dto.description or ("입금" if dto.amount > 0 else "출금"),
    }
