# src/routers/transaction.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from src.core.database import get_session
from src.models.transaction import Transaction
from src.schemas.transaction import TransactionRead

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get(
    "/{group_id}",
    response_model=list[TransactionRead],
    summary="특정 모임 거래내역 조회",
)
def get_transactions(group_id: int, session: Session = Depends(get_session)):
    rows = session.exec(
        select(Transaction)
        .where(Transaction.group_id == group_id)
        .options(selectinload(Transaction.participants))
    ).all()
    return rows
