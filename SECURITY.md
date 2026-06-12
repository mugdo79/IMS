# SECURITY.md

디지털 병리 IMS는 환자 식별정보(PHI/PII)를 다루는 임상 진단 시스템입니다. 이 문서는 인증/인가, 데이터 보호, 토큰 보안에 대한 결정을 정리합니다. 감사로그는 [`docs/product-specs/audit-log.md`](docs/product-specs/audit-log.md), 핵심 보안 원칙은 [`docs/design-docs/core-beliefs.md`](docs/design-docs/core-beliefs.md) 원칙 #2 참고.

## 인증 (Authentication)

- 사용자(판독의/병리사/관리자) 계정은 자체적으로 관리합니다 (이메일 + 비밀번호). 외부 SSO/LDAP 연동은 두지 않되, 향후 필요 시 추가할 수 있도록 인증 모듈을 분리해 구현합니다.
- 비밀번호는 bcrypt로 해시하여 저장합니다.
- 로그인 성공 시 JWT를 발급합니다:

| 토큰 | 용도 | 만료 | 저장 위치 |
|---|---|---|---|
| Access Token | API 요청 인증 | 30분 | 메모리 (frontend) |
| Refresh Token | Access Token 재발급 | 8시간 (근무 교대 주기 기준) | httpOnly + Secure 쿠키 |

- 로그인 실패가 일정 횟수(예: 5회) 누적되면 계정을 일시 잠금합니다 (brute-force 방어).
- 비밀번호 재설정 흐름은 [미해결](#미해결--추후-논의) 항목입니다.

## 인가 (Authorization) — 권한 매트릭스

역할(판독의/병리사/관리자) 정의는 [`PRODUCT_SENSE.md`](PRODUCT_SENSE.md) 참고. 아래는 다른 product-spec에 흩어진 권한 규칙을 통합한 매트릭스입니다.

| 작업 | 판독의 | 병리사 | 관리자 |
|---|---|---|---|
| Case/환자 정보 조회 (전체 목록) | O | O | O |
| Case 등록 (접수) | - | O | O |
| 검체/블록/슬라이드 등록·수정 | - | O | O |
| "검토 요청" (염색 → 검토) | - | O | O |
| WSI 뷰어 열람 | O | O | O |
| `Annotation` 작성/수정/삭제 | O (검토 상태에서만) | - | - |
| `CellAnnotation`(AI) 조회 | O | O | O |
| 담당 판독의 배정/재배정 | O | O | O |
| `Case.진단 소견` 작성/수정 | O | - | - |
| "서명" (검토 → 서명완료) | 담당 판독의만 | - | O |
| "재오픈" (서명완료 → 검토) | 서명한 본인만 | - | O |
| Case별 이력(`AuditLog`) 조회 | O | O | O |
| 시스템 전체 `AuditLog` 조회 | - | - | O |
| 사용자 계정 관리 (생성/역할변경/비활성화) | - | - | O |

백엔드는 모든 엔드포인트에서 위 매트릭스를 기준으로 권한을 검증합니다 — 프론트엔드의 UI 숨김은 보조적 수단일 뿐, 그것만으로 권한을 신뢰하지 않습니다.

## 타일서버 통신 토큰 보안

[`ARCHITECTURE.md`](ARCHITECTURE.md) 결정 #2의 토큰 기반 통신에 대한 보안 속성입니다.

- 토큰은 슬라이드 ID, 사용자 ID, 만료시간을 클레임으로 포함한 단기 서명 JWT입니다.
- 만료시간은 짧게(예: 10분) 설정하고, [`audit-log.md`](docs/product-specs/audit-log.md)의 세션 heartbeat에 맞춰 갱신합니다.
- tile-server는 서명/만료/슬라이드 ID 일치 여부만 검증하며 DB를 조회하지 않습니다 — 토큰 자체가 권한의 근거이므로 서명 키 보호가 중요합니다.
- 응답에는 `Cache-Control: private`을 적용해 CDN/공유 캐시에 PHI가 포함된 이미지가 남지 않도록 합니다.

## 데이터 보호

### PHI/PII 분류

| 엔티티 | PHI/PII 필드 |
|---|---|
| `Patient` | 환자번호(MRN), 이름, 생년월일, 성별 |
| `Case` | 접수번호, 의뢰의 (간접 식별 가능) |
| `Slide` (썸네일/라벨 이미지) | 슬라이드 라벨에 환자정보가 인쇄/필기되어 있을 수 있음 |

### 전송 / 저장

- 모든 통신은 HTTPS(TLS)를 강제합니다 (HSTS 적용).
- DB(PostgreSQL)와 WSI 원본 스토리지는 클라우드 제공자의 저장 시 암호화(encryption at rest)를 사용합니다. 컬럼 단위 애플리케이션 암호화는 MVP 범위에 포함하지 않습니다 ([`core-beliefs.md`](docs/design-docs/core-beliefs.md) 원칙 #4 — 운영 부담 최소화).
- 백업도 동일한 암호화 적용 범위에 포함됩니다.

## 네트워크 / 애플리케이션 보안

- CORS는 frontend origin만 허용합니다.
- 로그인 등 인증 엔드포인트에는 rate limiting을 적용합니다 (brute-force 방어).
- 의존성 취약점은 자동화된 스캐닝(Dependabot 등)으로 관리합니다 — 솔로 개발 운영 부담을 고려한 자동화 ([`core-beliefs.md`](docs/design-docs/core-beliefs.md) 원칙 #4).

## 계정 생명주기

- 퇴사/비활성 사용자 계정은 **삭제하지 않고 비활성화**합니다 — `Annotation`, `AuditLog` 등의 작성자 참조 무결성을 유지하기 위함입니다.
- 비활성화된 계정은 로그인할 수 없으며, 케이스 배정 대상에서 제외됩니다.

## 감사

모든 인증/인가 관련 이벤트와 PHI 접근은 `AuditLog`에 기록됩니다. 상세는 [`docs/product-specs/audit-log.md`](docs/product-specs/audit-log.md) 참고.

## 미해결 / 추후 논의

- 비밀번호 재설정 흐름 (이메일 인증 등)
- MFA 적용 여부 (특히 관리자 계정)
- JWT 서명 키 관리/로테이션 정책
- Rate limiting 구체적 임계값
- 컬럼 레벨 암호화 필요성 — 규제 검토 결과에 따라 재논의 ([`audit-log.md`](docs/product-specs/audit-log.md) 보존정책 미해결 항목과 연결)
