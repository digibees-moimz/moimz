# src/routers/_helpers.py  (한 파일에 같이 둬도 OK)
from fastapi import HTTPException
from sqlmodel import Session, select, func
from src.models import (
    Group, GroupAccount, UserAccount,
    Member, LockIn, GroupTransaction,
)

def get_group(session: Session, group_id: int) -> Group:
    grp = session.get(Group, group_id)
    if not grp:
        raise HTTPException(404, "Group not found")
    return grp

def get_group_account(session: Session, group_id: int) -> GroupAccount:
    return session.execute(
        select(GroupAccount).where(GroupAccount.group_id == group_id)
    ).scalars().first()

def get_user_account(session: Session, user_id: int) -> UserAccount:
    ua = session.execute(
        select(UserAccount).where(UserAccount.user_id == user_id)
    ).scalars().first()
    if not ua:
        raise HTTPException(404, "유저 계좌가 없어요")
    return ua

def locked_amounts_by_accounts(session: Session, ua_ids: list[int], group_id: int):
    # 계좌별 락인 총합을 한 방에!
    rows = session.execute(
        select(LockIn.user_account_id, func.sum(LockIn.amount))
        .where(
            LockIn.user_account_id.in_(ua_ids),
            LockIn.group_id == group_id
        )
        .group_by(LockIn.user_account_id)
    ).all()
    return {uid: amt for uid, amt in rows}

def group_balance(session: Session, group_account_id: int) -> float:
    return session.execute(
        select(func.coalesce(func.sum(GroupTransaction.amount), 0))
        .where(GroupTransaction.group_account_id == group_account_id)
    ).scalars().one()