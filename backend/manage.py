from flask_migrate import Migrate
from flask_script import Manager

from app import app
from models import db

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db')

if __name__ == '__main__':
    manager.run()
