# app

백엔드 주요 로직이 들어가는 폴더입니다.

## 하위 구조

- `routers/`: FastAPI 라우터 정의
- `services/`: 비즈니스 로직 (DB 조작, AI 호출 등)
- `models/`: DB 모델 정의 (SQLAlchemy)
- `schemas/`: 요청/응답 데이터 구조 (Pydantic 스키마)
- `utils/`: 공통 유틸 함수 (파일 저장, 시간 계산 등)
- `data/`: 초기 더미 데이터, 템플릿 파일 등
