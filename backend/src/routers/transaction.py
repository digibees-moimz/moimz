from fastapi import APIRouter
from sqlmodel import Session, select
from src.core.database import engine
from src.models.transaction import Transaction
from src.schemas.transaction import TransactionCreate, TransactionRead

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post(
    "",
    response_model=list[TransactionRead],
    summary="Create Transaction",
    description="지정된 user_id 리스트에 대해 총 금액을 1/N 분할하여 각 사용자에게 트랜잭션을 생성합니다.",
)
def create_transaction(data: TransactionCreate):
    with Session(engine) as session:
        split_amount = data.total_amount / len(data.user_ids)
        transactions = []

        for user_id in data.user_ids:
            transaction = Transaction(
                group_id=data.group_id,
                user_id=user_id,
                amount=split_amount,
                total_amount=data.total_amount,
                description=data.description,
            )
            session.add(transaction)
            transactions.append(transaction)

        session.commit()

        for t in transactions:
            session.refresh(t)

        return transactions

@router.get(
    "/{group_id}",
    response_model=list[TransactionRead],
    summary="Get Group Transactions",
    description="특정 그룹의 모든 트랜잭션 목록을 조회합니다.",
)
def get_transactions(group_id: int):
    with Session(engine) as session:
        transactions = session.exec(
            select(Transaction).where(Transaction.group_id == group_id)
        ).all()
        return transactions
