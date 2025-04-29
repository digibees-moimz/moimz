from fastapi import FastAPI
from src.core.database import init_db  # DB 연결 함수
from src.routers import user  # user API 라우터 import
from src.routers import account
from src.routers import group
from src.routers import transaction

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()  # 서버 켜질 때 DB 테이블 생성 (core/database.py의 engine = ... 라고 돼 있는거 실행하는 것)

app.include_router(user.router, prefix="/api")
app.include_router(account.router, prefix="/api")
app.include_router(group.router, prefix="/api")
app.include_router(transaction.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hello from moimz backend!"}
