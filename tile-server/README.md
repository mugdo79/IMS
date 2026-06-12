# tile-server

디지털 병리 IMS의 타일 서버. Flask app factory 패턴(`app/__init__.py`의 `create_app`).

## 실행

```bash
python -m venv .venv
source .venv/Scripts/activate   # Windows
# source .venv/bin/activate     # macOS/Linux

pip install -r requirements.txt -r requirements-dev.txt

flask run             # 개발 서버 (http://localhost:5000)
pytest                # 테스트
black --check .       # 포맷 검사
ruff check .          # 린트
```

## 현재 상태 / 알려진 제약

- `GET /health`만 구현되어 있습니다 (`app/routes/health.py`).
- WSI 읽기/타일 생성에 필요한 `openslide-python`, `pyvips`는 아직 `requirements.txt`에 포함하지 않았습니다 — 네이티브 라이브러리(OpenSlide, libvips) 설치가 필요하므로, 실제 타일 생성 기능을 구현하는 시점에 환경별 설치 방법과 함께 추가합니다.
- 토큰 검증(`ARCHITECTURE.md` 결정 #2) 등 인증 관련 로직은 아직 없습니다 — 구현 시 [`../AGENTS.md`](../AGENTS.md) 가드레일에 따라 별도 확인이 필요합니다.
