# 어노테이션 (Annotation)

판독의가 직접 작성하는 `Annotation`과 AI가 생성하는 `CellAnnotation`의 데이터 구조, 권한, 표시 방식을 정의합니다.
두 데이터의 구분 원칙은 [`core-beliefs.md`](../design-docs/core-beliefs.md) 원칙 #5, 작성 가능 시점은 [`case-status-workflow.md`](case-status-workflow.md) 참고.

## Annotation 타입

| 타입 | 설명 |
|---|---|
| **영역 (Region)** | 진단적으로 의미 있는 영역을 polygon/사각형 등으로 표시. 라벨/색상 지정 가능 |
| **측정 (Measurement)** | 선(거리) 또는 폐곡선(면적) 형태. `Slide.MPP`를 이용해 실제 단위(μm, mm²)로 환산한 값을 함께 저장 |
| **메모 (Note)** | 포인트 위치 + 텍스트 |

## 데이터 구조

- **좌표계**: 슬라이드 레벨 0(최대 해상도) 픽셀 좌표 기준 ([`ARCHITECTURE.md`](../../ARCHITECTURE.md) 데이터 흐름 — 어노테이션 요청은 슬라이드 픽셀 좌표 기준).
- **지오메트리**: GeoJSON 형식의 JSONB로 저장. `CellAnnotation`과 동일한 좌표계/형식을 사용해 뷰어 렌더링 로직을 공유합니다.
- **측정값**: 지오메트리로부터 계산한 실제 단위 값(길이/면적)을 함께 저장 — 매 조회마다 재계산하지 않고 작성/수정 시점에 산출. 표시 단위 정책은 [`wsi-viewer.md`](wsi-viewer.md) 참고.
- **작성자**: `작성자` 필드에 판독의를 기록.

## 권한

| 작업 | 가능한 역할 / 조건 |
|---|---|
| 조회 | 모든 역할 |
| 작성 / 수정 / 삭제 | 판독의 — `Case.상태`가 "검토"일 때만 |

- 담당 판독의가 아니어도 "검토" 상태 케이스에는 어노테이션 작성이 가능합니다 (협업/세컨드 오피니언). 작성자 필드로 누가 작성했는지 구분됩니다.
- "서명완료" 상태에서는 신규 작성/수정/삭제가 불가합니다 (재오픈 전까지) — [`case-status-workflow.md`](case-status-workflow.md)와 일치.

## 변경 이력 / 감사

- `Annotation` 테이블은 현재 상태만 저장합니다 (별도 버전 테이블 없음 — [`ARCHITECTURE.md`](../../ARCHITECTURE.md) 데이터 모델).
- 생성/수정/삭제 시 `AuditLog`에 변경 전/후의 지오메트리·타입·측정값 스냅샷을 기록합니다.
- 삭제는 하드 삭제입니다 — 이력은 `AuditLog`가 보존하므로 별도 soft-delete 플래그는 두지 않습니다 ([`core-beliefs.md`](../design-docs/core-beliefs.md) 원칙 #4).

## CellAnnotation(AI)과의 관계

- `Annotation`과 시각적으로 구분되는 별도 레이어/스타일로 표시되며, 토글로 표시·숨김이 가능합니다 ([`core-beliefs.md`](../design-docs/core-beliefs.md) 원칙 #5).
- MVP에서는 읽기 전용입니다 — 판독의가 직접 수정/삭제할 수 없습니다.
- 뷰포트(bounding box) 기반으로 조회합니다 ([`ARCHITECTURE.md`](../../ARCHITECTURE.md) 결정 #3, PostGIS 공간 쿼리).

## 미해결 / 추후 논의

- **CellAnnotation 피드백**: 판독의가 개별 AI 어노테이션을 확인/반려 표시하는 기능 — MVP 이후 (PRODUCT_SENSE.md "향후" 항목과 연결).
- **협업 기능**: Annotation에 댓글/스레드 등 — [`PRODUCT_SENSE.md`](../../PRODUCT_SENSE.md) "알림/협업 기능" 미해결 항목과 연결.
