# AGENTS.md

이 문서는 AI 에이전트(Claude Code 등)가 이 저장소에서 작업할 때 참고하는 운영 매뉴얼입니다.

## 프로젝트 개요

**디지털 병리 IMS (Image/Information Management System)** — 임상 진단용 웹 애플리케이션.

- 핵심 기능: WSI(Whole Slide Image) 뷰어, 케이스/슬라이드 관리, 어노테이션
- **이 시스템은 환자 식별정보(PHI/PII)를 다루며, 진단 정확성에 직접 영향을 줍니다.** 코드를 변경할 때 항상 이 점을 염두에 두세요.
- 설계 철학과 핵심 원칙은 `docs/design-docs/core-beliefs.md`를 참고하세요. (작성 예정)
- 시스템 구조와 핵심 아키텍처 결정은 [`ARCHITECTURE.md`](ARCHITECTURE.md)를 참고하세요.

## 저장소 구조 (모노레포)

```
/frontend     - Next.js + TypeScript + Tailwind CSS (뷰어 UI, 케이스 관리 UI, 어노테이션 UI)
/backend      - Spring Boot (도메인 로직, 인증/인가, 감사로그, 데이터 영속성)
/tile-server  - Flask + OpenSlide(읽기) + pyvips(타일 생성) (WSI 타일 서빙)
/docs         - 설계 문서, 제품 스펙, 실행 계획 등 (이 문서 체계)
```

각 서브시스템은 독립적으로 빌드/실행됩니다. 세부 구조는 각 디렉터리의 README를 참고하세요.

## 빌드 / 테스트 / 실행

### frontend (Next.js)

```bash
cd frontend
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm test         # 테스트 (Vitest)
```

### backend (Spring Boot)

```bash
cd backend
./gradlew bootRun   # 개발 서버 (로컬 PostgreSQL 필요, backend/README.md 참고)
./gradlew build     # 빌드 (테스트 포함, H2로 동작)
./gradlew test      # 테스트
```

### tile-server (Flask)

```bash
cd tile-server
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
flask run           # 개발 서버
pytest              # 테스트
black --check .     # 포맷 검사
ruff check .        # 린트
```

> OpenSlide/pyvips(WSI 읽기/타일 생성)는 아직 의존성에 포함되어 있지 않습니다 — `tile-server/README.md` 참고.

## 코딩 컨벤션

- **frontend**: TypeScript strict 모드, ESLint + Prettier 규칙 준수. 상세 컨벤션은 [`FRONTEND.md`](FRONTEND.md) 참고.
- **backend**: Spring Boot 표준 레이어드 아키텍처(Controller → Service → Repository). 패키지는 도메인 단위로 구성.
- **tile-server**: Black + Ruff 포맷/린트.

## UI / 에러 메시지 언어

- 사용자에게 노출되는 모든 텍스트(UI 라벨, 메시지, backend/tile-server가 반환하는 에러 메시지 등)는 **영문**으로 작성합니다 — 병원 환경에서는 한글보다 영문 UI를 선호합니다.
- 이 저장소의 문서(`*.md`), 커밋 메시지, 코드 주석은 한국어를 유지합니다. 이 정책은 사용자에게 노출되는 산출물에만 적용됩니다.

## 에이전트 작업 가드레일

이 프로젝트는 임상 진단용이므로, 아래 영역은 **변경 전 반드시 사용자 확인을 받습니다** (plan mode 또는 명시적 질문):

- 인증/인가 로직 (로그인, JWT 발급/검증, 권한 체크) — [`SECURITY.md`](SECURITY.md)
- 암호화/시크릿 관련 설정 (서명 키, DB 접속정보 등)
- PHI/PII 필드의 스키마 변경 또는 접근 범위 변경
- `AuditLog` 기록 로직 변경 또는 기존 레코드 삭제

위 목록 외의 작업(UI 스타일링, 로깅 추가, 테스트 작성, 리팩토링 등)은 자율적으로 진행 가능합니다.

## 도메인 용어

WSI, DZI, MPP, 케이스/검체/블록/슬라이드 관계 등 도메인 용어는 [`docs/references/glossary.md`](docs/references/glossary.md)를 참고하세요.

## 문서 내비게이션

| 알고 싶은 것 | 참고 문서 |
|---|---|
| 전체 문서 체계의 단계 구성 (이 문서들이 왜 이렇게 나뉘어 있는지) | [`docs/design-docs/documentation-structure.md`](docs/design-docs/documentation-structure.md) |
| 시스템 전체 구조, 데이터 흐름, 핵심 아키텍처 결정 | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| 설계 철학, 핵심 원칙 | [`docs/design-docs/core-beliefs.md`](docs/design-docs/core-beliefs.md) |
| 제품 요구사항, 사용자 워크플로우 | [`PRODUCT_SENSE.md`](PRODUCT_SENSE.md) |
| 기능별 상세 스펙 (케이스 워크플로우 등) | [`docs/product-specs/`](docs/product-specs/) |
| 환자 데이터 보호, 인증/인가 요구사항 | [`SECURITY.md`](SECURITY.md) |
| 운영 신뢰성, 백업/장애 대응 | [`RELIABILITY.md`](RELIABILITY.md) |
| 작업 완료 기준, 품질 지표 | [`QUALITY_SCORE.md`](QUALITY_SCORE.md) |
| 프론트엔드 구현 컨벤션 | [`FRONTEND.md`](FRONTEND.md) |
| 디자인 시스템 (시각 디자인) | `DESIGN.md` (작성 예정) |
| 진행 중/예정 작업 전체 목록 | [`PLANS.md`](PLANS.md) |
| 개별 작업의 상세 실행 계획 | [`docs/exec-plans/`](docs/exec-plans/) |
| 알려진 기술 부채 | [`tech-debt-tracker.md`](tech-debt-tracker.md) |
