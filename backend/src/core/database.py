from sqlmodel import SQLModel, create_engine
from sqlmodel import Session as SQLModelSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local.db")
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from src.models import *


def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_sqlmodel_session():
    with SQLModelSession(engine) as session:
        yield session
