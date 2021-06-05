import os


class Config(object):
    SECRET_KEY = os.urandom(24)
    PAGINATION = 10
    DB_NAME = "casting"
    SQLALCHEMY_DATABASE_URI = "postgresql://{}:{}@{}/{}".format('postgres', 'postgres', 'localhost:5432',
                                                                DB_NAME)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_LIFESPAN = {'hours': 24}
    JWT_REFRESH_LIFESPAN = {'days': 30}


class TestConfig(object):
    SECRET_KEY = os.urandom(24)
    PAGINATION = 10
    DB_NAME = "casting_test"
    SQLALCHEMY_DATABASE_URI = "postgresql://{}:{}@{}/{}".format('postgres', 'postgres', 'localhost:5432',
                                                                DB_NAME)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_LIFESPAN = {'hours': 24}
    JWT_REFRESH_LIFESPAN = {'days': 30}
