# frontend / backend / tile-server 스캐폴딩

## 목표

`AGENTS.md`/`ARCHITECTURE.md`/`FRONTEND.md`에 정의된 구조를 따르는 **최소 실행 가능한 스켈레톤**을 3개 서브시스템(`/frontend`, `/backend`, `/tile-server`)에 생성하고, `QUALITY_SCORE.md`의 빌드/테스트 DoD가 통과하는 상태로 만든다.

인증/인가 로직, 시크릿, PHI/PII 스키마, `AuditLog` 등 [`AGENTS.md`](../../../AGENTS.md) "에이전트 작업 가드레일" 영역의 실제 구현은 이번 스코프에 포함하지 않는다 (껍데기만 생성, 추후 별도 계획+사용자 확인).

## 진행 순서

frontend → tile-server → backend → 루트 정리 (frontend가 가장 예측 가능, tile-server에서 OpenSlide/pyvips 네이티브 의존성 이슈를 일찍 확인, backend는 Gradle wrapper 다운로드 등으로 가장 오래 걸려 마지막).

## 현재 상태 (완료)

- [x] `frontend/` — `create-next-app`(TS strict/Tailwind/App Router/ESLint, `src/` 없이) + TanStack Query/Zustand/OpenSeadragon + Vitest/RTL + `FRONTEND.md` 폴더 구조/placeholder 페이지. 검증: `npm run lint`, `npm run build`, `npm test` 모두 통과
- [x] `tile-server/` — Flask app factory + `/health` + `pytest`/Black/Ruff. `openslide-python`/`pyvips`는 이번 스코프에서 보류 (네이티브 의존성, 실제 타일 생성 구현 시점에 추가). 검증: `pytest`, `black --check .`, `ruff check .` 모두 통과
- [x] `backend/` — Spring Initializr(Gradle, Java 21, Spring Boot 4.1.0, web/data-jpa/postgresql/validation/actuator/lombok/h2), 패키지 `com.pathology.ims`. Spring Security는 제외(가드레일). 테스트는 H2(`src/test/resources/application.yml`)로 동작, `./gradlew build` 성공 (`BUILD SUCCESSFUL`, 8 tasks)
- [x] 루트 정리 — 루트 `.gitignore` 추가, 서브시스템별 `README.md`(frontend/backend/tile-server) 작성, `AGENTS.md` "빌드/테스트/실행" 섹션 최종화(초안 문구 제거, tile-server 명령 갱신), `PLANS.md` 갱신

## 미해결 / 보류 항목

- tile-server의 OpenSlide/pyvips 네이티브 의존성 설치 — 실제 타일 생성 기능 구현 시점에 다룸 (`tile-server/README.md`에 기록)
- backend `bootRun` 실행 검증 — 로컬 PostgreSQL 필요, 이번 스코프에서는 `./gradlew build`까지만 검증 (필요 환경변수는 `backend/README.md`에 문서화)
- Spring Security/인증 구현 — 별도 계획 + 사용자 확인 필요 (`SECURITY.md`)
- DB 마이그레이션 도구(Flyway 등) 선택 — 첫 엔티티/스키마 작업 시점에 결정
- frontend `npm audit` moderate 취약점(postcss, Next.js 내부 의존성) — `tech-debt-tracker.md`에 기록, Next.js 후속 릴리즈에서 재확인

## 다음 작업

3개 서브시스템 스캐폴딩과 루트 정리가 모두 완료되었다. 이 실행 계획은 `docs/exec-plans/completed/`로 이동 완료. 다음 작업은 `PLANS.md`의 "예정" 목록(`DESIGN.md`, `docs/generated/`) 또는 실제 도메인 기능(케이스/슬라이드 등) 구현 착수 — 사용자와 논의 후 결정.
