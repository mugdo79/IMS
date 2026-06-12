# 하네스 문서 체계 구축

## 목표

디지털 병리 IMS 프로젝트의 "harness engineering" 문서 체계(`AGENTS.md`, `ARCHITECTURE.md`, `docs/...`)를 단계적으로 채워나간다.

## 진행 순서 (합의됨)

1. 기반 문서: `AGENTS.md`, `ARCHITECTURE.md`, `docs/design-docs/core-beliefs.md`
2. 제품 문서: `PRODUCT_SENSE.md`, `docs/product-specs/`
3. 품질/운영: `QUALITY_SCORE.md`, `RELIABILITY.md`, `SECURITY.md`, `FRONTEND.md`, `DESIGN.md`
4. 실행 관리: `docs/exec-plans/`, `PLANS.md`, `tech-debt-tracker.md`
5. 참고/생성 자료: `docs/references/`, `docs/generated/`

각 단계가 답하는 질문과 포함 문서의 상세 정리는 [`docs/design-docs/documentation-structure.md`](../../design-docs/documentation-structure.md) 참고.

## 현재 상태 (2026-06-11)

- [x] `AGENTS.md` — 초안 작성 완료
- [x] `ARCHITECTURE.md` — 초안 작성 완료 (시스템 개요, 핵심 결정 3가지, 데이터 모델, 데이터 흐름)
- [x] `docs/references/glossary.md` — 핵심 용어 정리
- [x] `CLAUDE.md` — `@AGENTS.md` import 추가 (Claude Code 호환)
- [x] `docs/design-docs/core-beliefs.md` — 초안 작성 완료 (원칙 6가지: 진단 정확성, 환자 데이터 보호/감사, 비용 큰 결정 우선순위, 운영 부담 최소화, AI 보조 역할, 서비스 경계 영향 확인)
- [x] `PRODUCT_SENSE.md` — 초안 작성 완료 (사용자 역할 3종, 핵심 워크플로우 2가지, Product Sense 기준 5가지, MVP 범위)
- [x] `docs/product-specs/` — 작성 완료
  - [x] `case-status-workflow.md` — 작성 완료 (상태 전이 규칙/권한, 배정(self-claim+재배정), 진단 소견 필수, 케이스 유형은 단일 워크플로우+우선순위로 처리, 미해결 항목 모두 해소)
  - [x] `annotation.md` — 작성 완료 (Annotation 타입(영역/측정/메모), 좌표계/지오메트리, 권한(검토 상태에서 판독의), 변경이력은 AuditLog, CellAnnotation과의 레이어 구분)
  - [x] `wsi-viewer.md` — 작성 완료 (기본 동작/배율 표시, 슬라이드 간 이동, 레이어 구성(CellAnnotation 기본 OFF), 어노테이션 도구/단위 표시, 세션·토큰, 권한별 동작)
  - [x] `audit-log.md` — 작성 완료 (데이터 구조, 기록 이벤트 통합 정리, 세션 종료 heartbeat 제안, 조회 권한, 보존정책)
- [x] `SECURITY.md` — 작성 완료 (인증: 자체계정+JWT, 인가 권한 매트릭스 통합, 타일서버 토큰 보안, PHI/PII 분류, 전송/저장 암호화, 계정 생명주기, `AGENTS.md` 가드레일에 보안 영역 반영)
- [x] `RELIABILITY.md` — 작성 완료 (데이터 내구성>가용성, 백업(DB PITR+WSI 스토리지 내구성), 장애 등급표, 모니터링/알림, 타일 캐시 신뢰성, 배포/마이그레이션 안전성)
- [x] `QUALITY_SCORE.md` — 작성 완료 (서브시스템별 DoD 체크리스트 + 품질 지표 표, 시큐어 코딩(OWASP Top 10) 항목 포함)
- [x] `FRONTEND.md` — 작성 완료 (기술 스택: Next.js App Router+TanStack Query+Zustand+OpenSeadragon, 폴더 구조, WSI 뷰어 구현(어노테이션 오버레이/이미지 보정 WebGL 레이어), 테스트)
- [ ] `DESIGN.md` — 스캐폴딩 이후로 보류 (시각 디자인 토큰/컴포넌트 스타일은 실제 UI 구현 시점에 정의)
- [x] `docs/exec-plans/README.md` — 작성 완료 (active/completed 구조, 새 계획 작성 가이드, 라이프사이클)
- [x] `PLANS.md` — 작성 완료 (진행 중/예정/완료 작업 목록)
- [x] `tech-debt-tracker.md` — 작성 완료 (사용법 정의, 현재 항목 없음)
- [x] `docs/references/glossary.md` — 1단계에서 이미 작성 완료
- [ ] `docs/generated/` — 스캐폴딩 이후로 보류 (코드 기반 자동 생성 문서)

## ARCHITECTURE.md에서 확정된 핵심 결정 (요약 — 상세는 ARCHITECTURE.md 참고)

- 모노레포: `/frontend`(Next.js+Tailwind+TS), `/backend`(Spring Boot), `/tile-server`(Flask+OpenSlide+pyvips)
- 클라우드 배포 + WSI 파일용 스토리지 추상화 레이어 (온프레미스 전환 가능하게)
- 프론트엔드 ↔ 타일서버는 backend가 발급한 단기 서명 토큰으로 직접 통신
- 단일 PostgreSQL+PostGIS DB. `Patient → Case → Specimen → Block → Slide → Annotation` 계층 + 별도 `slide_id` 파티셔닝 `CellAnnotation` 테이블 (향후 AI 형태계측, 슬라이드당 ~10만 행)
- 타일 생성: OpenSlide(리더, 포맷 호환성) + pyvips(고품질 리샘플링/인코딩), **지연 생성 + 캐시** — 이전 OpenSlide 단독 구성에서 판독의가 "세포 구분 시 타일 비선명" 피드백을 줘서 전환. 전체 사전생성 대비 저장공간을 사용량 기반으로 절감 (ARCHITECTURE.md 결정 #4)
- 뷰어 이미지 보정(감마/밝기/명암/ICC 프로필 적용 토글)은 클라이언트 측 렌더링 레이어(필터/3D LUT)에서 처리 — 타일 캐시와 독립적 (ARCHITECTURE.md 결정 #5)

## 미해결/보류 항목

- `AGENTS.md`의 "에이전트 작업 가드레일" — 작업 중 위험 영역 발견 시 채워나가기로 함
- 토큰 갱신 흐름 상세 설계 (감사로그 세션 종료 heartbeat와 결합 가능 — `audit-log.md`)
- 스토리지 추상화 레이어 구현체 선정
- 배포 인프라 상세 (오케스트레이션, CI/CD)
- `AuditLog` 보존 기간 — 의료법상 진료기록 보존 요구사항 확인 필요 (`audit-log.md`)
- Case 상세 화면 구성 (검체/블록/슬라이드 등록 UI, 진단소견 입력 위치, 이력 탭 배치) — 3단계 이후 product-spec으로 다룰 예정
- 인증 세부 정책 (비밀번호 재설정, MFA, JWT 서명 키 관리/로테이션, rate limiting 임계값) — `SECURITY.md`
- 장애 알림 채널, DB 백업 보존 기간, DR, RTO/RPO 수치 — `RELIABILITY.md`
- 타일 캐시 저장 위치/정리 정책, PNG 적용 범위, ICC→3D LUT 구현 — `ARCHITECTURE.md` 결정 #4·#5, `RELIABILITY.md`
- 이미지 보정 WebGL 레이어와 OpenSeadragon 연동 지점/성능, 어노테이션 오버레이 라이브러리 선택 — `FRONTEND.md`
- `DESIGN.md` 작성 — 스캐폴딩 이후로 보류
- `docs/generated/` 구성 — 스캐폴딩 이후로 보류

## 다음 작업

4단계 완료. 5단계는 `docs/references/glossary.md`(완료) 외 `docs/generated/`는 스캐폴딩 이후로 보류 — 하네스 문서 체계 구축의 핵심 작업은 모두 완료되었다. 이 실행 계획은 `docs/exec-plans/completed/`로 이동 완료. 다음은 frontend/backend/tile-server 스캐폴딩 착수 (`PLANS.md` 참고).
