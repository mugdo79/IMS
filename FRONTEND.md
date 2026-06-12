# FRONTEND.md

`/frontend`의 구현 컨벤션을 정의합니다. 시각 디자인(색상/타이포그래피/컴포넌트 스타일)은 `DESIGN.md`(작성 예정)에서 다루며, 이 문서는 코드 구조·상태관리·뷰어 구현 방식 등 **구현 패턴**을 다룹니다. 화면별 동작/요구사항은 [`docs/product-specs/`](docs/product-specs/), 타일/토큰 흐름과 이미지 보정 레이어는 [`ARCHITECTURE.md`](ARCHITECTURE.md) 결정 #2·#5를 참고하세요.

## 기술 스택

- **Next.js (App Router)** + TypeScript strict 모드
- **Tailwind CSS** — 스타일링
- **TanStack Query (React Query)** — 서버 상태(케이스/슬라이드/어노테이션 등 backend API 데이터) 페칭/캐싱
- **Zustand** — 뷰어 UI 상태(보정 슬라이더 값, 레이어 토글, 현재 줌/팬 등 여러 컴포넌트가 공유하는 클라이언트 상태)
- **OpenSeadragon** — WSI 타일 뷰어 (동작/레이어 구성은 [`wsi-viewer.md`](docs/product-specs/wsi-viewer.md))

## 폴더 구조

```
app/
  (auth)/login/
  cases/
    page.tsx                  # 워크리스트 (케이스 목록)
    [caseId]/
      page.tsx                # 케이스 상세
      slides/[slideId]/
        page.tsx              # WSI 뷰어
  admin/                       # 관리자 화면 (계정/권한, 감사로그 조회)
components/
  viewer/                      # OpenSeadragon 래퍼, 이미지 보정 레이어, 어노테이션 오버레이
  annotations/
  cases/
  ui/                          # 공용 UI 프리미티브 (DESIGN.md 기반)
lib/
  api/                         # backend REST 클라이언트
hooks/
```

라우트 구조는 URL/코드 조직 수준의 골격이며, 화면별 상세 구성(Case 상세 화면 등)은 해당 product-spec 작성 시 함께 결정합니다.

## 데이터 페칭 / 상태관리

- backend API 호출은 TanStack Query로 감쌉니다. 인증은 httpOnly 쿠키([`SECURITY.md`](SECURITY.md))로 처리되므로 클라이언트가 Access/Refresh 토큰을 직접 다루지 않습니다.
- tile-server용 단기 서명 토큰([`ARCHITECTURE.md`](ARCHITECTURE.md) 결정 #2)은 슬라이드 열람 시 backend 응답으로 받아 뷰어 컴포넌트의 상태로만 보관합니다(영구 저장/재사용 안 함). 슬라이드 전환 시 새로 요청합니다.
- 뷰어 UI 상태(보정값, 레이어 토글 등)는 Zustand 스토어로 관리해 툴바/캔버스 등 여러 컴포넌트에서 공유합니다.

## WSI 뷰어 구현

- **베이스 타일**: OpenSeadragon이 DZI 디스크립터 + tile-server URL + 토큰으로 타일을 요청합니다 ([`ARCHITECTURE.md`](ARCHITECTURE.md) 결정 #2·#4).
- **어노테이션 오버레이**: `Annotation`/`CellAnnotation`의 지오메트리(레벨0 픽셀 좌표, [`annotation.md`](docs/product-specs/annotation.md))를 OpenSeadragon 뷰포트 좌표로 변환해 SVG/Canvas 오버레이로 렌더링하고, 줌/팬 시 뷰포트 변환에 동기화합니다.
- **이미지 보정 레이어** ([`ARCHITECTURE.md`](ARCHITECTURE.md) 결정 #5): 감마/밝기/명암 + ICC 3D LUT을 하나의 WebGL 셰이더로 적용합니다. OpenSeadragon의 타일 로드 콜백에서 각 타일에 셰이더를 적용한 뒤 그리는 방식을 기본 접근으로 하며, 정확한 연동 지점(OpenSeadragon 훅, 성능)은 구현 시 검증이 필요합니다 — [미해결](#미해결--추후-논의).

## 컴포넌트 / 스타일 컨벤션

- 함수형 컴포넌트 + TypeScript, props는 명시적 인터페이스로 정의합니다.
- Tailwind 유틸리티 클래스를 우선 사용하고, 반복되는 조합은 `components/ui/`에 프리미티브로 추출합니다.
- 디자인 토큰(색상/타이포그래피 등)은 `DESIGN.md`(작성 예정)에서 정의되며, Tailwind 설정에 반영합니다.

## 테스트

- 단위/컴포넌트 테스트: Vitest + React Testing Library.
- E2E 테스트 도구/범위는 [`QUALITY_SCORE.md`](QUALITY_SCORE.md) 미해결 항목 참고.

## 국제화 / 접근성

- 화면에 표시되는 모든 텍스트(UI 라벨, 메시지, 에러 등)는 **영문**으로 작성합니다 — 병원 환경에서는 한글보다 영문 UI를 선호합니다 ([`AGENTS.md`](AGENTS.md) "UI / 에러 메시지 언어"). backend/tile-server가 반환하는 에러 메시지도 동일하게 영문입니다.
- 단일 언어(영문)이므로 별도 i18n 프레임워크는 도입하지 않습니다 ([`core-beliefs.md`](docs/design-docs/core-beliefs.md) 원칙 #4).
- 접근성은 기본 수준(시맨틱 HTML, 키보드 포커스, 색상 대비)을 따릅니다.

## 미해결 / 추후 논의

- 이미지 보정 WebGL 레이어와 OpenSeadragon 연동 지점/성능 검증
- 어노테이션 오버레이 구현 시 라이브러리(직접 구현 vs 플러그인) 선택
- E2E 테스트 도구/범위 ([`QUALITY_SCORE.md`](QUALITY_SCORE.md))
