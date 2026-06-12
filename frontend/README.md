# frontend

디지털 병리 IMS의 프론트엔드. Next.js(App Router) + TypeScript + Tailwind CSS.

구현 컨벤션(폴더 구조, 상태관리, 뷰어 구현 방식)은 [`../FRONTEND.md`](../FRONTEND.md)를 참고하세요.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm test         # Vitest
```

## 환경변수

`.env.example`을 `.env.local`로 복사해 사용합니다.

- `NEXT_PUBLIC_API_BASE_URL` — backend API base URL (기본값: `http://localhost:8080`)

## 현재 상태 / 알려진 제약

- `app/cases`, `app/cases/[caseId]`, `app/cases/[caseId]/slides/[slideId]`, `app/admin`, `app/(auth)/login` 등은 스캐폴딩 단계의 placeholder 페이지입니다.
- WSI 뷰어(`components/viewer/WsiViewer.tsx`)와 어노테이션 오버레이(`components/annotations/AnnotationOverlay.tsx`)는 OpenSeadragon 연동 전 placeholder입니다.
- 로그인 페이지는 UI 뼈대만 있으며, 인증/인가 로직은 별도 계획 + 사용자 확인 후 구현됩니다 ([`../SECURITY.md`](../SECURITY.md), [`../AGENTS.md`](../AGENTS.md) 가드레일).
