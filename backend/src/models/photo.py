# backend/src/models/photo.py
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON
from typing import Optional
from datetime import datetime


class Photo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    user_id: Optional[int] = Field(
        default=None, foreign_key="useraccount.id"
    )  # 업로더 (회원가입 없이도 None 가능)
    file_name: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    face_processed: bool = False  # 얼굴 분류 완료 여부


class Face(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    photo_id: int = Field(foreign_key="photo.id")
    location: list[int] = Field(sa_column=Column(JSON))  # [top, right, bottom, left]
    person_id: int = Field(default=0)  # 0이면 미분류 (unknown)
    encoding: bytes
    too_small: bool = False  # 얼굴 크기가 너무 작아서 제외할지 여부


class FaceRepresentative(SQLModel, table=True):
    group_id: int = Field(primary_key=True)
    person_id: int = Field(primary_key=True)
    vector: bytes  # 대표 벡터


class PersonInfo(SQLModel, table=True):
    group_id: int = Field(primary_key=True)
    person_id: int = Field(primary_key=True)
    name: str = ""
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
