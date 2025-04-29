from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.user import User, UserAccount
from src.schemas.user import UserCreate, UserRead, UserDetail

router = APIRouter()

@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate):
    with Session(engine) as session:
        # 이메일 중복 체크
        dup = session.exec(select(User).where(User.email == user_in.email)).first()
        if dup:
            raise HTTPException(400, detail="Email already registered")

        user = User(**user_in.dict())
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

@router.get("/users", response_model=list[UserRead])
def get_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return users

@router.get("/users/{user_id}", response_model=UserDetail)
def get_user_detail(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        accounts = session.exec(
            select(UserAccount).where(UserAccount.user_id == user_id)
        ).all()

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "balance": user.balance,
            "accounts": accounts
        }
