import os

from sqlalchemy import Column, String, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
    removed the config and moved it to config.py file
'''


def setup_db(app):
    db.app = app
    db.init_app(app)
    db.create_all()


'''
Question
'''


class Question(db.Model):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True)
    question = Column(String)
    answer = Column(String)
    category = Column(Integer)
    difficulty = Column(Integer)
    rating = Column(Integer)

    def __init__(self, question, answer, category, difficulty, rating):
        self.question = question
        self.answer = answer
        self.category = category
        self.difficulty = difficulty
        self.rating = rating

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer,
            'category': self.category,
            'difficulty': self.difficulty,
            'rating': self.rating
        }


'''
Category
'''


class Category(db.Model):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    type = Column(String)

    def __init__(self, type):
        self.type = type

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'type': self.type
        }


'''
Quiz
'''


class Quiz(db.Model):
    __tablename__ = 'quiz'

    def __init__(self, score, user_id):
        self.score = score
        self.user_id = user_id

    id = Column(Integer, primary_key=True)
    score = db.Column(Integer)
    user_id = Column(Integer, db.ForeignKey('users.id', ondelete="cascade"),
                     nullable=False)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'score': self.score,
            'user_id': self.user_id
        }

    @classmethod
    def get_quizzes(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()


'''
User
'''


class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(db.String, nullable=False)
    roles = Column(db.String)
    is_active = Column(db.Boolean, default=True)
    score = db.relationship('Quiz',
                            backref="user_scores",
                            lazy=True)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'username': self.username,
            'active': self.is_active,
            'roles': self.roles,
        }

    def is_valid(self):
        return self.is_active

    @property
    def identity(self):
        return self.id

    @property
    def rolenames(self):
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @property
    def password(self):
        return self.hashed_password

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def identify(cls, id):
        return cls.query.filter_by(id=id).first()
