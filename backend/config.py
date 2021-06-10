import os


class Config(object):
    SECRET_KEY = os.urandom(24)
    PAGINATION = 10
    DB_NAME = "casting"
    DEFAULT_DB = "postgresql://{}:{}@{}/{}".format('postgres', 'postgres', 'localhost:5432',
                                                   DB_NAME)
    DB_PATH = os.getenv('DATABASE_URL', DEFAULT_DB)
    if DB_PATH.startswith("postgres://"):
        DB_PATH = DB_PATH.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = DB_PATH
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_LIFESPAN = {'hours': 24}
    JWT_REFRESH_LIFESPAN = {'days': 30}


class TestConfig(object):
    SECRET_KEY = os.urandom(24)
    PAGINATION = 10
    DB_NAME = "casting_test"
    DEFAULT_DB = "postgresql://{}:{}@{}/{}".format('postgres', 'postgres', 'localhost:5432',
                                                   DB_NAME)
    DB_PATH = os.getenv('TEST_DATABASE_URL', DEFAULT_DB)
    if DB_PATH.startswith("postgres://"):
        DB_PATH = DB_PATH.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = DB_PATH
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_LIFESPAN = {'hours': 24}
    JWT_REFRESH_LIFESPAN = {'days': 30}
