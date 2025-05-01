from fastapi import APIRouter
from sqlmodel import Session, select
from src.core.database import engine
from src.models.transaction import Transaction
from src.schemas.transaction import TransactionRead
from sqlalchemy.orm import selectinload

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get(
    "/{group_id}",
    response_model=list[TransactionRead],
    summary="특정 모임 거래내역 조회",
    description="특정 그룹의 모든 트랜잭션 목록을 조회합니다.",
)
def get_transactions(group_id: int):
    with Session(engine) as session:
        transactions = session.exec(
            select(Transaction).where(Transaction.group_id == group_id)
            .options(selectinload(Transaction.participants)) 

        ).all()
        return transactions
