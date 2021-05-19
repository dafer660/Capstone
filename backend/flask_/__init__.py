import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
# from flask_praetorian import Praetorian, auth_required, current_user
import random

from .config import TestConfig, Config

from werkzeug.utils import secure_filename

from .models import setup_db, Question, Category, User, Quiz

UPLOAD_FOLDER = '..\\frontend\\public'

db = SQLAlchemy()
cors = CORS()
migrate = Migrate()
guard = Praetorian()


# Do pagination stuff here
def paginate(request, selection):
    page = request.args.get('page', 1, type=int)
    start = (page - 1) * Config.PAGINATION
    end = start + Config.PAGINATION

    obj_list = [obj.format() for obj in selection]
    pagination = obj_list[start:end]

    return pagination


# Return a dict with the categories
def categorize(category_obj=None):
    if category_obj is None:
        category_obj = Category.query.all()
    return {category.id: category.type for category in category_obj}


def create_app(config_file=Config):
    app = Flask(__name__)

    app.config.from_object(config_file)

    db.init_app(app=app)
    cors.init_app(app, resources={r"*": {"origins": "*"}})
    migrate.init_app(app=app, db=db)
    guard.init_app(app=app, user_class=User)

    with app.app_context():
        setup_db(app)

        if User.lookup('trivia') is None:
            trivia_user = User(
                username='trivia',
                hashed_password=guard.hash_password('trivia'),
                roles='admin'
            )
            trivia_user.insert()

    # Just do CORS stuff here before request
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')

        return response

    '''
    Test route for authentication
    '''

    @app.route('/test', methods=['GET'])
    @auth_required
    def test():
        return {'message': f'protected endpoint (allowed user {current_user().username})'}

    '''
    User is checked here, if logged in or not
    '''

    @app.route('/user', methods=['GET'])
    @auth_required
    def user():
        try:
            user = current_user()
            ret = {
                'user': user.format(),
                'status': 200,
                'authenticated': True
            }
        except:
            ret = {
                'user': {},
                'status': 401,
                'authenticated': False
            }

        return ret

    '''
    Login implemented here
    '''

    @app.route('/login', methods=['POST'])
    def login():
        try:
            req = request.get_json(force=True)

            username = req.get('username', None)
            password = req.get('password', None)

            user = guard.authenticate(username, password)

            ret = {
                      'status': 200,
                      'authenticated': True,
                      'token': guard.encode_jwt_token(user),
                      'user': user.format()
                  }, 200

        except:
            ret = {
                      'status': 400,
                      'authenticated': False,
                      'message': 'We could not log you in'
                  }, 400

        return ret

    '''
    Register is implemented here
    '''

    @app.route('/register', methods=['POST'])
    def register():
        req = request.get_json(force=True)

        username = req.get('username', None)
        password = req.get('password', None)
        repeat_password = req.get('repeat_password', None)

        user_exists = User.query.filter_by(username=username).first()

        if len(username) <= 0 or len(password) <= 0 or len(repeat_password) <= 0:
            abort(400, "cannot submit empty fields")

        if user_exists:
            abort(400, 'user already registered')

        if password == repeat_password:
            new_user = User(
                username=username,
                hashed_password=guard.hash_password(password),
                roles='user'
            )
            new_user.insert()

            ret = {
                'registered': True,
                'status': 200
            }

        else:

            ret = {
                'registered': False,
                'message': 'We could not register your username',
                'status': 400
            }

        return ret

    '''
    Get the categories here
    '''

    @app.route('/categories', methods=['GET'])
    def get_categories():
        categories = Category.query.order_by(Category.id).all()

        if len(categories) == 0:
            abort(404)

        return jsonify({
            'categories': categorize(),
            'total_categories': len(categories)
        })

    '''
    Add a category here
    '''

    @app.route('/category', methods=['POST'])
    def new_category():
        form_category = request.form.get('category')
        image = request.files

        if 'image' not in image:
            abort(500, 'No image was selected...')

        if Category.query.filter_by(type=form_category).first() is not None:
            abort(500, 'Category {} already exists...'.format(
                form_category
            ))

        category = Category(type=request.form.get('category'))
        filename = secure_filename(
            "{}.{}".format(
                request.form.get('category').lower(),
                image['image'].filename.split('.')[-1])
        )

        category.insert()
        image['image'].save(os.path.join(UPLOAD_FOLDER, filename))

        return jsonify({
            'category': form_category,
            'image': image['image'].filename,
        })

    '''
    Get the questions and paginate them
    '''

    @app.route('/questions', methods=['GET'])
    def main_questions():
        sel_questions = Question.query.order_by(Question.id).all()
        current_questions = paginate(request, sel_questions)

        if len(current_questions) == 0:
            abort(404)

        return jsonify({
            'questions': current_questions,
            'total_questions': len(Question.query.all()),
            'categories': categorize(),
            'current_category': {}
        })

    '''
    Delete a question here
    '''

    @app.route('/questions/<int:question_id>', methods=['DELETE'])
    def remove_question(question_id):
        try:
            current_question = Question.query.filter_by(id=question_id).first_or_404()

            if current_question is None:
                abort(404)

            current_question.delete()
            sel_questions = Question.query.order_by(Question.id).all()
            current_questions = paginate(request, sel_questions)

            return jsonify({
                'questions': current_questions,
                'total_questions': len(Question.query.all()),
                'categories': categorize(),
                'current_category': {}
            })

        except:
            abort(422)

    '''
    Create a new question here
    '''

    @app.route('/question', methods=['POST'])
    def new_question():
        form_request = request.get_json(force=True)

        question = Question(question=form_request['question'],
                            answer=form_request['answer'],
                            category=form_request['category'],
                            difficulty=form_request['difficulty'],
                            rating=form_request['rating'])
        question.insert()

        return jsonify({
            'question': form_request['question'],
            'answer': form_request['answer'],
            'category': form_request['category'],
            'difficulty': form_request['difficulty'],
            'rating': form_request['rating']
        })

    '''
    Search for terms in any question
    '''

    @app.route('/questions', methods=['POST'])
    def get_questions():
        search_term = request.json['searchTerm']
        search = "%{}%".format(search_term)

        searched_questions = Question.query.filter(
            Question.question.ilike(search)
        ).all()
        current_questions = paginate(request, searched_questions)

        return jsonify({
            'questions': current_questions,
            'total_questions': len(searched_questions),
            'current_category': {}
        })

    '''
    Get questions by category
    '''

    @app.route('/categories/<int:category_id>/questions', methods=['GET'])
    def get_by_category(category_id):
        category = Category.query.filter_by(id=category_id).first_or_404()
        questions = Question.query.filter(Question.category == category.id).all()

        selected_questions = paginate(request, questions)

        return jsonify({
            'questions': selected_questions,
            'total_questions': len(questions),
            'current_category': category.format()
        })

    '''
    Play the quiz
    '''

    @app.route('/quizzes', methods=['POST'])
    def quizz_time():
        data = request.get_json(force=True)
        previous_questions = data['previous_questions']
        quiz_category = data['quiz_category']

        if quiz_category['id'] == 0:
            questions_by_category = Question.query.all()
        else:
            questions_by_category = Question.query.filter(Question.category == quiz_category['id']).all()

        '''
        to prevent the "Unable to load questions dialog" and
        reach the 5 questions per play when we have less than
        5 questions for a specific category, for example
        '''
        if len(questions_by_category) <= len(previous_questions):
            previous_questions = []

        random_question = random.choice(
            [question.format() for question in questions_by_category if question.id not in previous_questions]
        )

        return jsonify({
            'previousQuestions': previous_questions,
            'question': random_question
        })

    '''
    Save the score of the user
    '''

    @app.route('/save_score', methods=['POST'])
    @auth_required
    def save_score():
        data = request.get_json(force=True)

        try:
            username = data['user']['username']
            score = data['num_correct']

            user = User.query.filter_by(username=username).first()
            if user is None:
                abort(400)

            saved_score = Quiz(score=score, user_id=user.id)
            saved_score.insert()

            ret = jsonify({
                'status': 200,
                'message': "score saved"
            })

        except:
            ret = jsonify({
                'status': 400,
                'message': "score could not be saved"
            })

        return ret

    '''
    Error Handlers go here
    '''

    @app.errorhandler(400)
    def bad_reques(error):
        return jsonify({
            'message': error.description,
            'error': 400,
            'success': False
        }), 400

    @app.errorhandler(401)
    def not_found(error):
        return jsonify({
            'message': error.description,
            'error': 401,
            'success': False
        }), 401

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'message': error.description,
            'error': 404,
            'success': False
        }), 404

    @app.errorhandler(405)
    def not_allowed(error):
        return jsonify({
            'message': error.description,
            'error': 405,
            'success': False
        }), 405

    @app.errorhandler(422)
    def unprocessable_entity(error):
        return jsonify({
            'message': error.description,
            'error': 422,
            'success': False
        }), 422

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'message': error.description,
            'error': 500,
            'success': False
        }), 500

    return app


APP = create_app()

if __name__ == '__main__':
    APP.run(host='0.0.0.0', port=8080, debug=True)
