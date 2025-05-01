from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.user import User, UserAccount
from src.schemas.user import UserCreate, UserRead, UserDetail

router = APIRouter(prefix="/users", tags=["Users"])

@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="유저 생성",
    description="이메일 중복 검사를 통해 새로운 유저를 생성하고, 계좌도 자동으로 연결합니다.",
)
def create_user(user_in: UserCreate):
    with Session(engine) as session:
        # 이메일 중복 체크
        dup = session.exec(select(User).where(User.email == user_in.email)).first()
        if dup:
            raise HTTPException(400, detail="Email already registered")

        # 1. 유저 생성
        user = User(
            name=user_in.name,
            email=user_in.email,
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        # 2. 계좌 생성 (자동 연결)
        account = UserAccount(
            user_id=user.id,
            account_name=user_in.account_name,
            account_number=user_in.account_number,
            balance=0.0,
        )
        session.add(account)
        session.commit()

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }


@router.get(
    "",
    response_model=list[UserRead],
    summary="전체 유저 조회",
    description="전체 사용자 목록을 조회합니다.",
)
def get_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return users

@router.get(
    "/{user_id}",
    response_model=UserDetail,
    summary="특정 유저 상세조회",
    description="특정 사용자(user_id)의 상세 정보와 계좌 목록을 조회합니다.",
)
def get_user_detail(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        accounts = session.exec(
            select(UserAccount).where(UserAccount.user_id == user_id)
        ).first()  # 하나만 가져오기, 왜냐면 아이디당 통장 1개로 수정했으니까

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "account": accounts
        }
