from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, create_engine
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

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


class MoviesCategories(db.Model):
    __tablename__ = 'movies_categories'

    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey('movies.id', ondelete='CASCADE'))
    category_id = Column(Integer, ForeignKey('category.id', ondelete='CASCADE'))

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class MoviesActors(db.Model):
    __tablename__ = 'movies_actors'

    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey('movies.id', ondelete='CASCADE'))
    actor_id = Column(Integer, ForeignKey('actors.id', ondelete='CASCADE'))

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Category(db.Model):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True)
    name = Column(String)

    def __init__(self, name):
        self.name = name

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
            'name': self.name
        }


class Actors(db.Model):
    __tablename__ = 'actors'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    joined_in = Column(Date)

    # Foreign Keys
    agent_id = Column(Integer, ForeignKey('agents.id', ondelete='CASCADE'))

    def __init__(self, name, age, gender, agent_id, joined_in=datetime.now()):
        self.name = name
        self.age = age
        self.gender = gender
        self.joined_in = joined_in
        self.agent_id = agent_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        curr_agent = Agents.query.filter_by(id=self.agent_id).first()
        if curr_agent is None:
            agent = None
        else:
            agent = curr_agent.name

        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'joined_in': self.joined_in,
            'agent': agent,
            'agent_id': self.agent_id
        }


class Agents(db.Model):
    __tablename__ = 'agents'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    joined_in = Column(Date, default=datetime.now())

    # One to Many
    actors = db.relationship('Actors', backref=db.backref('actors', passive_deletes=True, lazy='dynamic'))

    def __init__(self, name, joined_in=datetime.now()):
        self.name = name
        self.joined_in = joined_in

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
            'name': self.name,
            'joined_in': self.joined_in
        }


class Movies(db.Model):
    __tablename__ = 'movies'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    release_date = Column(Date)
    rating = Column(Integer)

    # Many to Many
    actors = db.relationship('Actors',
                             secondary='movies_actors', lazy='joined',
                             backref=db.backref('actors', lazy='dynamic', passive_deletes=True))
    categories = db.relationship('Category',
                                 secondary='movies_categories', lazy='joined',
                                 backref=db.backref('categories', lazy='dynamic', passive_deletes=True))

    def __init__(self, title, release_date, rating):
        self.title = title
        self.release_date = release_date
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
            'title': self.title,
            'release_date': self.release_date,
            'categories': [category.name for category in self.categories],
            'actors': [actor.name for actor in self.actors],
            'rating': self.rating
        }
