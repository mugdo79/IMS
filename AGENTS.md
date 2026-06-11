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

각 서브시스템은 독립적으로 빌드/실행됩니다. 세부 구조는 각 디렉터리의 README를 참고하세요. (스캐폴딩 후 작성 예정)

## 빌드 / 테스트 / 실행

> 아래 명령어는 각 서브시스템이 표준 구조로 스캐폴딩된 것을 전제로 한 초안입니다. 실제 스캐폴딩 후 이 섹션을 검증하고 업데이트하세요.

### frontend (Next.js)

```bash
cd frontend
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm test         # 테스트
```

### backend (Spring Boot)

```bash
cd backend
./gradlew bootRun   # 개발 서버
./gradlew build     # 빌드
./gradlew test      # 테스트
```

### tile-server (Flask + OpenSlide + pyvips)

```bash
cd tile-server
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
flask run           # 개발 서버
pytest              # 테스트
```

## 코딩 컨벤션

- **frontend**: TypeScript strict 모드, ESLint + Prettier 규칙 준수. 상세 컨벤션은 `FRONTEND.md` 참고. (작성 예정)
- **backend**: Spring Boot 표준 레이어드 아키텍처(Controller → Service → Repository). 패키지는 도메인 단위로 구성.
- **tile-server**: Black + Ruff 포맷/린트.

## 에이전트 작업 가드레일

이 프로젝트는 임상 진단용이므로, 아래 영역은 **변경 전 반드시 사용자 확인을 받습니다** (plan mode 또는 명시적 질문):

- (현재 비어있음 — 작업 중 위험하다고 판단되는 영역을 발견하면, 에이전트가 사용자에게 가드레일 추가를 제안할 것)

위 목록 외의 작업(UI 스타일링, 로깅 추가, 테스트 작성, 리팩토링 등)은 자율적으로 진행 가능합니다.

## 도메인 용어

WSI, DZI, MPP, 케이스/검체/블록/슬라이드 관계 등 도메인 용어는 [`docs/references/glossary.md`](docs/references/glossary.md)를 참고하세요.

## 문서 내비게이션

| 알고 싶은 것 | 참고 문서 |
|---|---|
| 시스템 전체 구조, 데이터 흐름, 핵심 아키텍처 결정 | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| 설계 철학, 핵심 원칙 | [`docs/design-docs/core-beliefs.md`](docs/design-docs/core-beliefs.md) |
| 제품 요구사항, 사용자 워크플로우 | [`PRODUCT_SENSE.md`](PRODUCT_SENSE.md) |
| 환자 데이터 보호, 인증/인가 요구사항 | `SECURITY.md` (작성 예정) |
| 프론트엔드 컨벤션 / 디자인 시스템 | `FRONTEND.md`, `DESIGN.md` (작성 예정) |
| 진행 중인 작업 | [`docs/exec-plans/active/`](docs/exec-plans/active/) — 현재는 `harness-documentation-setup.md` |
