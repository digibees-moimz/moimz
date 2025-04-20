# layout 컴포넌트 설명

이 폴더에는 공통 레이아웃 컴포넌트들이 포함되어 있습니다.

## 구성

- `AppLayout.tsx`: 레이아웃의 최상단 래퍼 컴포넌트입니다.
  - 내부에서 `Header`, `TabNav`를 포함하여 하위 children을 감쌉니다.
- `Header.tsx`: 뒤로가기 아이콘 포함된 상단 헤더
- `TabNav.tsx`: 상단 탭바 (커뮤니티 / 앨범 / 캘린더 + 설정 버튼)

## 사용 안내

**주의**: `AppLayout`은 `app/layout.tsx` (RootLayout)에서 이미 적용되므로,  
각 개별 페이지 컴포넌트에서는 `AppLayout`을 다시 불러올 필요가 없습니다.
