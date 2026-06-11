# 하네스 문서 체계 구축

## 목표

디지털 병리 IMS 프로젝트의 "harness engineering" 문서 체계(`AGENTS.md`, `ARCHITECTURE.md`, `docs/...`)를 단계적으로 채워나간다.

## 진행 순서 (합의됨)

1. 기반 문서: `AGENTS.md`, `ARCHITECTURE.md`, `docs/design-docs/core-beliefs.md`
2. 제품 문서: `PRODUCT_SENSE.md`, `docs/product-specs/`
3. 품질/운영: `QUALITY_SCORE.md`, `RELIABILITY.md`, `SECURITY.md`, `FRONTEND.md`, `DESIGN.md`
4. 실행 관리: `docs/exec-plans/`, `PLANS.md`, `tech-debt-tracker.md`
5. 참고/생성 자료: `docs/references/`, `docs/generated/`

## 현재 상태 (2026-06-11)

- [x] `AGENTS.md` — 초안 작성 완료
- [x] `ARCHITECTURE.md` — 초안 작성 완료 (시스템 개요, 핵심 결정 3가지, 데이터 모델, 데이터 흐름)
- [x] `docs/references/glossary.md` — 핵심 용어 정리
- [x] `CLAUDE.md` — `@AGENTS.md` import 추가 (Claude Code 호환)
- [x] `docs/design-docs/core-beliefs.md` — 초안 작성 완료 (원칙 6가지: 진단 정확성, 환자 데이터 보호/감사, 비용 큰 결정 우선순위, 운영 부담 최소화, AI 보조 역할, 서비스 경계 영향 확인)
- [x] `PRODUCT_SENSE.md` — 초안 작성 완료 (사용자 역할 3종, 핵심 워크플로우 2가지, Product Sense 기준 5가지, MVP 범위)
- [ ] `docs/product-specs/` — 다음 작업

## ARCHITECTURE.md에서 확정된 핵심 결정 (요약 — 상세는 ARCHITECTURE.md 참고)

- 모노레포: `/frontend`(Next.js+Tailwind+TS), `/backend`(Spring Boot), `/tile-server`(Flask+OpenSlide+pyvips)
- 클라우드 배포 + WSI 파일용 스토리지 추상화 레이어 (온프레미스 전환 가능하게)
- 프론트엔드 ↔ 타일서버는 backend가 발급한 단기 서명 토큰으로 직접 통신
- 단일 PostgreSQL+PostGIS DB. `Patient → Case → Specimen → Block → Slide → Annotation` 계층 + 별도 `slide_id` 파티셔닝 `CellAnnotation` 테이블 (향후 AI 형태계측, 슬라이드당 ~10만 행)
- 타일 생성: OpenSlide(리더, 포맷 호환성) + pyvips(`dzsave`, 고품질 리샘플링/인코딩) — 이전 OpenSlide 단독 구성에서 판독의가 "세포 구분 시 타일 비선명" 피드백을 줘서 전환

## 미해결/보류 항목

- `AGENTS.md`의 "에이전트 작업 가드레일" — 작업 중 위험 영역 발견 시 채워나가기로 함
- 토큰 갱신 흐름 상세 설계
- 스토리지 추상화 레이어 구현체 선정
- 배포 인프라 상세 (오케스트레이션, CI/CD)

## 다음 작업

`PRODUCT_SENSE.md` 작성 완료. `docs/product-specs/`로 이어가거나, 사용자가 3단계(품질/운영 문서)를 우선하면 그쪽으로 전환한다.
