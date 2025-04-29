from fastapi import APIRouter
from sqlmodel import Session, select
from src.core.database import engine
from src.models.transaction import Transaction
from src.schemas.transaction import TransactionCreate, TransactionRead

router = APIRouter()

@router.post("/transactions", response_model=list[TransactionRead])
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

@router.get("/transactions/{group_id}", response_model=list[TransactionRead])
def get_transactions(group_id: int):
    with Session(engine) as session:
        transactions = session.exec(
            select(Transaction).where(Transaction.group_id == group_id)
        ).all()
        return transactions
