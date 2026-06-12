# backend

디지털 병리 IMS의 백엔드. Spring Boot(Java 21, Gradle) 표준 레이어드 아키텍처(Controller → Service → Repository), 패키지 루트는 `com.pathology.ims`.

## 실행

```bash
./gradlew build     # 빌드 (테스트 포함)
./gradlew test      # 테스트만
./gradlew bootRun   # 개발 서버 (http://localhost:8080)
```

`build`/`test`는 `src/test/resources/application.yml`의 H2 인메모리 DB로 동작하므로 외부 의존성 없이 통과합니다.

## 환경변수 (bootRun에 필요)

`bootRun`은 PostgreSQL에 연결합니다 (`src/main/resources/application.yml`). 로컬에 PostgreSQL을 띄우고 아래 환경변수로 접속 정보를 지정하세요 (값은 모두 개발용 기본값이며 실제 운영 자격증명이 아닙니다):

| 변수 | 기본값 |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `ims` |
| `DB_USERNAME` | `ims` |
| `DB_PASSWORD` | `ims` |

## 현재 상태 / 알려진 제약

- 도메인 엔티티/API는 아직 없으며(스캐폴딩 단계), `BackendApplicationTests`의 `contextLoads()`만 존재합니다.
- Spring Security/인증·인가는 이번 스코프에서 제외되어 있습니다 — 별도 계획 + 사용자 확인 후 구현합니다 ([`../SECURITY.md`](../SECURITY.md), [`../AGENTS.md`](../AGENTS.md) 가드레일).
- DB 마이그레이션 도구(Flyway 등) 도입 여부는 첫 엔티티/스키마 작업 시점에 결정합니다.
