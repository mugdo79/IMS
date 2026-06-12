# 문서 체계 구조 (Documentation Structure)

디지털 병리 IMS의 문서 하네스는 5단계로 구성됩니다. 이 문서는 각 단계가 어떤 질문에 답하고 어떤 문서를 포함하는지 정리합니다. 실제 작업 진행 상태(완료/보류 항목)는 [`docs/exec-plans/completed/harness-documentation-setup.md`](../exec-plans/completed/harness-documentation-setup.md)를 참고하세요.

## 1단계 — 기반 (Foundation)

**질문: 이 시스템은 무엇이고, 어떻게 구성되어 있으며, 왜 그렇게 결정했는가?**

- [`AGENTS.md`](../../AGENTS.md): AI 에이전트가 이 저장소에서 작업할 때 참고하는 운영 매뉴얼 — 프로젝트 개요, 저장소 구조, 빌드/테스트, 코딩 컨벤션, 작업 가드레일, 문서 내비게이션
- [`ARCHITECTURE.md`](../../ARCHITECTURE.md): 시스템 구성, 핵심 아키텍처 결정과 그 배경, 데이터 모델, 데이터 흐름, 미결정 항목
- [`core-beliefs.md`](core-beliefs.md): 기술적 판단의 기준이 되는 핵심 원칙

## 2단계 — 제품 (Product)

**질문: 누가 이 시스템을 사용하고, 어떤 워크플로우로 무엇을 하는가?**

- [`PRODUCT_SENSE.md`](../../PRODUCT_SENSE.md): 사용자 역할, 핵심 워크플로우, 이 도메인에서 "좋은 제품"의 기준, MVP 범위
- [`docs/product-specs/`](../product-specs/): 기능별 상세 스펙 (케이스 상태 워크플로우, 어노테이션, WSI 뷰어, 감사로그 등)

## 3단계 — 품질/운영 (Quality & Operations)

**질문: 이 시스템이 안전하고 신뢰할 수 있으며 품질 기준을 충족한다는 것을 어떻게 보장하는가? 코드는 어떤 컨벤션으로 작성하는가?**

- [`QUALITY_SCORE.md`](../../QUALITY_SCORE.md): 작업 완료 기준(Definition of Done)과 추적할 품질 지표
- [`RELIABILITY.md`](../../RELIABILITY.md): 데이터 내구성/백업, 장애 등급, 모니터링, 배포 안전성
- [`SECURITY.md`](../../SECURITY.md): 인증/인가, 권한 매트릭스, 데이터 보호, 네트워크/앱 보안
- [`FRONTEND.md`](../../FRONTEND.md): frontend 기술 스택, 폴더 구조, 상태관리, 뷰어 구현 컨벤션
- `DESIGN.md` (보류): 시각 디자인 시스템 — 스캐폴딩 이후 실제 UI 구현 시점에 작성

## 4단계 — 실행 관리 (Execution Management)

**질문: 지금 무엇을 하고 있고, 다음에 무엇을 해야 하며, 무엇이 아직 해결되지 않았는가?**

- [`docs/exec-plans/`](../exec-plans/): 진행 중인 작업의 실행 계획 (현재 상태, 미해결 항목, 다음 작업) — 구조/작성법은 [`docs/exec-plans/README.md`](../exec-plans/README.md)
- [`PLANS.md`](../../PLANS.md): 진행 중/예정 작업의 상위 목록
- [`tech-debt-tracker.md`](../../tech-debt-tracker.md): 구현 후 의도적으로 남겨둔 단축/단순화 기록

## 5단계 — 참고/생성 자료 (Reference & Generated)

**질문: 세부 용어나 참고 정보는 어디서 찾고, 코드로부터 자동 생성되는 문서는 무엇인가?**

- [`docs/references/`](../references/): 용어집 등 정적 참고 자료
- `docs/generated/` (예정): 코드베이스에서 자동 생성되는 문서 (API 스펙, 스키마 다이어그램 등) — 스캐폴딩 이후 의미를 가짐

## 단계 간 관계

1~3단계는 비교적 안정적인 "기준" 문서입니다 — 새 기능/변경이 기존 문서와 어긋나지 않는지 확인하는 대상입니다 ([`QUALITY_SCORE.md`](../../QUALITY_SCORE.md) DoD 참고). 4~5단계는 작업이 진행되며 자주 갱신되는 "운영" 문서입니다.
