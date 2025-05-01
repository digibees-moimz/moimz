from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from src.core.database import init_db  # DB 연결 함수
from src.routers import (
    user,
    account,
    group,
    transaction,
    group_account,
    event,
    board,
    photo,
    diary,
    face,
    attendance,
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()  # 서버 켜질 때 DB 테이블 생성 (core/database.py의 engine = ... 라고 돼 있는거 실행하는 것)


app.include_router(user.router, prefix="/api")
app.include_router(account.router, prefix="/api")
app.include_router(group.router, prefix="/api")
app.include_router(transaction.router, prefix="/api")
app.include_router(group_account.router, prefix="/api")
app.include_router(event.router, prefix="/api")
app.include_router(board.router, prefix="/api")
app.include_router(photo.router, prefix="/api")
app.include_router(diary.router, prefix="/api")
app.include_router(face.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Hello from moimz backend!"}
