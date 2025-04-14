# moimz 프론트엔드

Next.js + Tailwind 기반 프론트엔드 프로젝트입니다.

## 개발 실행

npm run dev

→ http://localhost:3000 접속

## 환경 변수

`frontend/.env.local` 파일에 아래 내용 추가:

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

## 폴더 구조
```
src/ 
├── app/ # 페이지 라우팅 
├── components/ # UI 컴포넌트 
├── styles/ # 글로벌 스타일 
└── lib/ # API 연동 등 유틸 함수
```
