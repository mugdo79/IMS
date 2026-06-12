# tech-debt-tracker.md

구현 과정에서 의도적으로 선택한 단축/단순화와, 이를 나중에 다시 다뤄야 하는 이유를 기록합니다.

설계상 아직 결정하지 않은 사항은 기술 부채가 아니라 "미해결/추후 논의"이며, 각 문서(`ARCHITECTURE.md`, `SECURITY.md` 등)의 해당 섹션에서 다룹니다. 이 문서는 **이미 구현된 후 의도적으로 남겨둔 단순화/우회**만 다룹니다.

## 사용법

새 항목을 추가할 때 아래 형식을 따릅니다:

- **항목**: 무엇을 단순화/우회했는가
- **위치**: 관련 코드/파일
- **이유**: 왜 지금 이렇게 했는가
- **해결 조건**: 언제/어떤 상황에서 다시 다뤄야 하는가

## 현재 항목

- **항목**: `frontend`의 `next` 패키지가 내부적으로 의존하는 `postcss` 버전에 moderate 등급 취약점(CSS 출력 시 `</style>` 미escape로 인한 XSS, GHSA-qx2v-qp2m-jg93)이 있음 (`npm audit`)
- **위치**: `frontend/node_modules/next/node_modules/postcss` (직접 의존성 아님, `next` 16.2.x canary 내부 의존성)
- **이유**: `npm audit fix --force`는 `next`를 9.x로 다운그레이드하므로 적용 불가. 스캐폴딩 시점의 `create-next-app` 최신판이 이 버전을 받아옴
- **해결 조건**: `next`의 안정 릴리스가 `postcss` 의존성을 업데이트하면 `npm update next`로 재확인
