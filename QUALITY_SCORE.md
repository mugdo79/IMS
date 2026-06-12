# QUALITY_SCORE.md

이 문서는 변경(코드/문서)을 "완료되었다"고 판단하는 기준(Definition of Done)과, 서브시스템별로 추적할 품질 지표를 정의합니다. [`AGENTS.md`](AGENTS.md)의 작업 가드레일과 [`docs/design-docs/core-beliefs.md`](docs/design-docs/core-beliefs.md)의 원칙을 실무 체크리스트로 구체화한 문서입니다.

에이전트는 작업을 완료로 보고하기 전에 해당하는 항목을 자체 점검합니다.

## 작업 완료 기준 (Definition of Done)

### 공통 (모든 변경)

- [ ] 의도한 동작을 확인했다 (자동 테스트 또는 수동 확인)
- [ ] 입력 검증, 인젝션/XSS 방지 등 OWASP Top 10 기준 시큐어 코딩 원칙을 준수했다 ([`SECURITY.md`](SECURITY.md) "네트워크/앱 보안"의 인프라·의존성 수준 통제와는 별도로, 코드 레벨에서 확인)
- [ ] 사용자에게 노출되는 텍스트(UI 라벨, 에러 메시지 등)는 영문으로 작성했다 ([`AGENTS.md`](AGENTS.md) "UI / 에러 메시지 언어")
- [ ] 변경 내용이 `ARCHITECTURE.md` / `docs/product-specs/` / `SECURITY.md` / `RELIABILITY.md` 등 기존 문서와 어긋나지 않는다. 어긋난다면 해당 문서를 함께 갱신했다
- [ ] PHI/PII, 인증/인가, `AuditLog`와 관련된 변경이라면 [`AGENTS.md`](AGENTS.md) "에이전트 작업 가드레일"에 따라 사용자 확인을 거쳤다

### frontend

- [ ] `npm run lint`, `npm run build` 통과 (TypeScript strict 오류 없음)
- [ ] UI 변경은 브라우저에서 골든 패스 + 주요 엣지케이스를 실제로 확인했다
- [ ] 좌표/배율/측정값(MPP) 관련 변경은 실제 슬라이드에서 표시값을 재확인했다 ([`core-beliefs.md`](docs/design-docs/core-beliefs.md) 원칙 #1)

### backend

- [ ] `./gradlew build`, `./gradlew test` 통과
- [ ] 새 엔드포인트/도메인 로직에 권한 검증(RBAC)이 누락되지 않았다 ([`SECURITY.md`](SECURITY.md) 권한 매트릭스 기준)
- [ ] 환자 데이터 접근/변경 경로에는 `AuditLog` 기록이 포함된다 ([`core-beliefs.md`](docs/design-docs/core-beliefs.md) 원칙 #2)
- [ ] DB 스키마 변경은 backward-compatible 방식인지 확인했다 ([`RELIABILITY.md`](RELIABILITY.md))

### tile-server

- [ ] `pytest` 통과, Black + Ruff 통과
- [ ] 타일 생성/인코딩 파라미터를 변경한 경우, 실제 슬라이드 이미지로 세포 구분이 가능한 수준의 선명도를 시각 확인했다 ([`core-beliefs.md`](docs/design-docs/core-beliefs.md) 원칙 #1, [`ARCHITECTURE.md`](ARCHITECTURE.md) 결정 #4)

## 품질 지표 (추적 대상)

각 서브시스템 스캐폴딩 시점에 측정 도구를 설정하고, 아래 표의 목표치를 그때 함께 확정합니다.

| 영역 | 지표 | 목표 |
|---|---|---|
| frontend | 타입/린트 경고 수 | 0 유지 |
| backend | 테스트 커버리지 | [미정](#미해결--추후-논의) |
| tile-server | 테스트 커버리지 | [미정](#미해결--추후-논의) |
| 전체 | CI에서 빌드/테스트/린트 자동 실행 | 미정 — CI 도입 시점에 결정 ([`ARCHITECTURE.md`](ARCHITECTURE.md) 미결정: 배포 인프라) |

## 미해결 / 추후 논의

- 서브시스템별 테스트 커버리지 목표 수치
- CI/CD 도입 시점 및 위 체크리스트의 자동화 범위
- 타일 품질의 정량적 검증 방법 (현재는 판독의 정성 평가에 의존)
- E2E 테스트 도구/범위
