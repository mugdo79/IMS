from flask import Flask

from app.config import config_by_name


def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    from app.routes.health import health_bp

    app.register_blueprint(health_bp)

    return app
