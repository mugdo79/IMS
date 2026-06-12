class Config:
    TESTING = False


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": Config,
}
