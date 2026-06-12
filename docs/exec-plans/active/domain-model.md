# 도메인 모델(JPA 엔티티) 설계

## 목표

`PRODUCT_SENSE.md`의 MVP 범위(케이스/검체/블록/슬라이드 관리, 수동 어노테이션, 케이스 상태 워크플로우, 감사로그)에 해당하는 backend 도메인 모델을 `ARCHITECTURE.md` "데이터 모델"을 기준으로 JPA 엔티티/리포지토리로 설계·구현한다.

`CellAnnotation`(AI 셀 어노테이션)과 PostGIS는 `PRODUCT_SENSE.md`에서 "향후" 범위로 분류되어 있어 이번 스코프에서 제외한다 — AI 연동 작업 시점에 별도로 다룬다.

## 배경 / 컨텍스트

- frontend/backend/tile-server 스캐폴딩(`docs/exec-plans/completed/scaffolding.md`) 완료 후 다음 작업으로 선정됨.
- **PHI/PII 필드의 스키마 변경**에 해당하므로 [`AGENTS.md`](../../../AGENTS.md) "에이전트 작업 가드레일" 대상 — 사용자 요청에 따라 **plan mode**로 진행 중 (계획에 대한 ExitPlanMode 승인이 가드레일의 "사용자 확인" 역할을 함).
- 리서치 완료: `ARCHITECTURE.md`(데이터 모델, 핵심 결정 1~5), `PRODUCT_SENSE.md`, `docs/product-specs/{case-status-workflow,annotation,audit-log,wsi-viewer}.md`, `SECURITY.md`, `QUALITY_SCORE.md`, `docs/design-docs/core-beliefs.md`, `docs/references/glossary.md`, `tech-debt-tracker.md`.

## 현재 상태

- [x] 관련 문서 리서치 완료
- [ ] **DB 스키마 관리 방식 결정 (Flyway vs Hibernate ddl-auto)** — 다음 세션에서 가장 먼저 다룰 항목. 아래 "미해결" 참고
- [ ] 패키지 구조 / 엔티티 / 리포지토리 / enum 설계 확정 (초안은 아래 "설계 초안")
- [ ] 계획을 plan 파일로 정리하고 ExitPlanMode 승인 받기
- [ ] 구현 (엔티티, 리포지토리, 마이그레이션/스키마, `@DataJpaTest`)
- [ ] `./gradlew build`/`test` 통과 확인, `PLANS.md`/exec-plan 갱신

## 설계 초안 (다음 세션에서 검토·확정)

### 엔티티 목록 (MVP)

| 엔티티 | 패키지/테이블명 | 주요 필드 | 비고 |
|---|---|---|---|
| `User` | `user` / `users` | 이름, 역할(`UserRole`: PATHOLOGIST/LAB_TECHNICIAN/ADMIN), 면허번호, 활성화여부 | `user`는 SQL 예약어라 테이블명 `users` |
| `Patient` | `patient` / `patients` | MRN(unique, PHI), 이름(PHI), 생년월일(PHI), 성별(PHI) | |
| `Case` | `cases` / `cases` | 접수번호(unique), `Patient` FK, 의뢰의, 케이스유형(`CaseType`), 상태(`CaseStatus`: RECEIVED/STAINING/IN_REVIEW/SIGNED_OFF), 우선순위(`CasePriority`), 담당판독의(`User` FK, nullable), 진단소견 | `case`는 Java/SQL 예약어라 패키지/테이블명 `cases` |
| `Specimen` | `specimen` / `specimens` | `Case` FK, 부위/명칭 | |
| `Block` | `block` / `blocks` | `Specimen` FK, 블록번호/라벨 | |
| `Slide` | `slide` / `slides` | `Block` FK, 스토리지키, 스캐너/포맷, 배율, MPP(double), 염색종류, 스캔상태(`SlideScanStatus`: PENDING/PROCESSING/READY/FAILED), 썸네일/라벨이미지 키 | |
| `Annotation` | `annotation` / `annotations` | `Slide` FK, 작성자(`User` FK), 타입(`AnnotationType`: REGION/MEASUREMENT/NOTE), 지오메트리(JSON, GeoJSON), 측정값 | |
| `AuditLog` | `audit` / `audit_logs` | 사용자(`User` FK), 액션(`AuditAction`), 대상엔티티타입(`AuditTargetType`)+대상ID, 타임스탬프, IP, 상세(JSON) | append-only — 리포지토리에 update/delete 메서드 노출 안 함 |

### 공통

- `BaseEntity` (abstract): `id`(Long, `GenerationType.IDENTITY`), `createdAt`/`updatedAt` (JPA Auditing, `@CreatedDate`/`@LastModifiedDate`). `AuditLog`는 자체 타임스탬프(`occurredAt`)만 사용, `updatedAt` 불필요.
- Lombok `@Getter @Setter @NoArgsConstructor`, `equals/hashCode`는 `id` 기준으로만 (`@EqualsAndHashCode(onlyExplicitlyInclude = true)`).
- Jakarta Validation 애너테이션(`@NotNull`, `@Size` 등) 적용.
- 연관관계는 `@ManyToOne(fetch = LAZY)` 기본.
- 모든 enum은 `@Enumerated(EnumType.STRING)` — 추후 값 추가가 backward-compatible.

### Enum 초안

- `UserRole`: PATHOLOGIST, LAB_TECHNICIAN, ADMIN
- `CaseStatus`: RECEIVED, STAINING, IN_REVIEW, SIGNED_OFF (`docs/product-specs/case-status-workflow.md` 접수/염색/검토/서명완료)
- `CasePriority`: ROUTINE, URGENT (placeholder — 실제 값은 제품 논의 후 확장 가능)
- `CaseType`: ROUTINE_BIOPSY, FROZEN_SECTION, OTHER (placeholder)
- `AnnotationType`: REGION, MEASUREMENT, NOTE
- `SlideScanStatus`: PENDING, PROCESSING, READY, FAILED (placeholder)
- `AuditAction`: CREATE, UPDATE, DELETE, CASE_STATUS_CHANGE, CASE_ASSIGNEE_CHANGE, SLIDE_VIEW_SESSION_START
- `AuditTargetType`: PATIENT, CASE, SPECIMEN, BLOCK, SLIDE, ANNOTATION, USER

### 스코프 경계

- 이번 작업은 **Entity + Repository(+enum)까지만** 다룬다. Controller/Service(REST API)는 포함하지 않음 — `SECURITY.md` 권한 매트릭스에 따른 인가 검증이 필요한데, 이는 인증/인가 가드레일 영역이라 별도 계획+사용자 확인이 필요하기 때문.
- `CellAnnotation`/PostGIS는 향후 AI 연동 작업으로 보류.
- `AuditLog`는 엔티티/리포지토리 정의까지만 — 실제 "기록 로직"(어떤 시점에 어떤 액션을 기록할지)은 해당 비즈니스 로직(Case 상태 전이, Annotation CRUD 등) 구현 시점에 함께 추가.

## 미해결 / 보류

- **DB 마이그레이션 전략 결정 (최우선)**: `docs/exec-plans/completed/scaffolding.md`에서 "첫 엔티티/스키마 작업 시점에 결정"으로 미뤄둔 항목.
  - **옵션 A: Flyway 도입 (권장)** — `src/main/resources/db/migration/`에 SQL 마이그레이션 작성. PostgreSQL과 H2(PostgreSQL 호환 모드, `MODE=PostgreSQL`)에 동일 스크립트 적용 — `jsonb` 대신 양쪽 다 지원되는 `json` 타입 사용(PostGIS/`jsonb`는 향후 CellAnnotation 작업 때 재검토). Hibernate는 `ddl-auto=validate`로 엔티티-스키마 일치만 검증. 스키마 변경 이력이 git에 남아 리뷰 가능 — `QUALITY_SCORE.md`의 "DB 스키마 변경은 backward-compatible 방식인지 확인" 항목과 부합.
  - **옵션 B: Hibernate ddl-auto 유지** — 현재 스캐폴딩 방식(H2 test는 `create-drop`) 그대로. 더 간단하지만 스키마 변경 이력/리뷰가 어렵고, 프로덕션 배포 전 별도 마이그레이션 도구 도입이 필요해짐.
  - 2026-06-12: 사용자가 이 질문에 대해 "명확히 하고 싶다"고 답했으나 구체적 추가 질문 없이 세션 종료 — **다음 세션에서 이 결정을 먼저 다뤄야 함**.
- `CellAnnotation`/PostGIS 도입 — AI 연동 작업 시점
- Controller/Service(REST API) + 인증/인가 — 별도 계획 + 사용자 확인 (`SECURITY.md`, `AGENTS.md` 가드레일)
- `CasePriority`/`CaseType`/`SlideScanStatus`의 실제 값 목록 — placeholder, 제품 논의 후 확정 가능 (enum 값 추가는 backward-compatible)

## 다음 작업

1. plan mode 재진입 → "DB 마이그레이션 전략" 질문부터 이어가기 (Flyway vs ddl-auto)
2. 위 설계 초안을 바탕으로 최종 계획 작성 → ExitPlanMode 승인
3. 구현 → `./gradlew build`/`test` 통과 확인
4. 이 실행 계획을 `completed/`로 이동, `PLANS.md` 갱신
