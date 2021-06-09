import os

from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin

from config import TestConfig, Config
from models import setup_db, Movies, Actors, Category, MoviesCategories, MoviesActors, Agents
from auth import requires_auth

db = SQLAlchemy()
cors = CORS()
migrate = Migrate()


def paginate(request, selection):
    """
    Function that handles pagination
    :param request: request passed used to get the current page
    :param selection: the object from the database to paginate
    :return: the paginated object, containing a list with the formatted objects
    """
    page = request.args.get('page', 1, type=int)
    start = (page - 1) * Config.PAGINATION
    end = start + Config.PAGINATION

    obj_list = [obj.format() for obj in selection]
    pagination = obj_list[start:end]

    return pagination


def create_app(config_file=Config):
    """
    Used to create the flask app
    :param config_file: a config file, which you can setup in the config.py file - defaults to Config
    :return: returns the flask app
    """
    app = Flask(__name__)

    app.config.from_object(config_file)

    db.init_app(app=app)
    # cors.init_app(app, resources={r"*": {"origins": "*"}})
    cors.init_app(app)
    migrate.init_app(app=app, db=db)

    with app.app_context():
        setup_db(app)

    # Just do CORS stuff here before request
    @app.after_request
    def after_request(response):
        """
        Function that handles CORS
        :param response: response header
        :return: returns the response with CORS headers
        """
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')

        return response

    @app.route('/')
    def index():
        return "<h1>Capstone API</h1>"

    @app.route('/movies', methods=['GET'])
    @cross_origin()
    @requires_auth('get:movies')
    def get_movies(payload):
        """
        Get the Movies here and paginate them
        :param payload:
        :return: a json object containing the paginated movies and the total movies
        """
        movies = Movies.query.order_by(Movies.id).all()

        if len(movies) == 0:
            abort(404, 'Sorry, we could not find any Movies to display.')

        return jsonify({
            'movies': paginate(request, movies),
            'total_movies': len(movies)
        })

    @app.route('/agents', methods=['GET'])
    @cross_origin()
    @requires_auth('get:agents')
    def get_agents(payload):
        """
        GET method to fetch all the agents from the database
        :return: json object containing the paginated agents, and total of agents
        """
        agents = Agents.query.order_by(Agents.id).all()

        if len(agents) == 0:
            abort(404, 'Sorry, we could not find any Agents.')

        return jsonify({
            'agents': paginate(request, agents),
            'total_agents': len(agents)
        })

    @app.route('/categories', methods=['GET'])
    @cross_origin()
    @requires_auth('get:categories')
    def get_categories(payload):
        """
        GET method to fetch the categories and paginate them
        :return: json object containing all categories and total categories
        """
        categories = Category.query.order_by(Category.id).all()

        if len(categories) == 0:
            abort(404, 'Sorry, we could not find any Categories.')

        return jsonify({
            'categories': paginate(request, categories),
            'total_categories': len(categories)
        })

    @app.route('/actors', methods=['GET'])
    @cross_origin()
    @requires_auth('get:actors')
    def get_actors(payload):
        """
        GET method to fetch all the actors
        :return: json object containing the paginated actors and total of actors
        """
        actors = Actors.query.order_by(Actors.id).all()

        if len(actors) == 0:
            abort(404, 'Sorry, we could not find any Agents to display.')

        return jsonify({
            'actors': paginate(request, actors),
            'total_actors': len(actors)
        })

    @app.route('/agent/<int:agent_id>', methods=['GET'])
    @cross_origin()
    @requires_auth('patch:agents')
    def get_agent(payload, agent_id):
        """
        GET method to fetch the agent based on agent_id passed
        :param agent_id: the id of the current agent to fetch from the database
        :return: json object containing the agent in a proper format
        """
        agent = Agents.query.filter_by(id=agent_id).first_or_404()

        if agent is None:
            abort(404, 'Sorry, we could not find any Agents to display.')

        return jsonify({
            'agent': agent.format(),
        })

    @app.route('/actor/<int:actor_id>', methods=['GET'])
    @cross_origin()
    @requires_auth('patch:actors')
    def get_actor(payload, actor_id):
        """
        GET method to fetch the actor based on actor_id passed
        :param actor_id: the id of the current actor to fetch from the database
        :return: json object containing the actor in a proper format
        """
        actor = Actors.query.filter_by(id=actor_id).first_or_404()

        if actor is None:
            abort(404, 'Sorry, we could not find any Agents to display.')

        return jsonify({
            'actor': actor.format(),
        })

    @app.route('/movie/<int:movie_id>', methods=['GET'])
    @cross_origin()
    @requires_auth('patch:movies')
    def get_movie(payload, movie_id):
        """
        GET method to fetch the movie based on movie_id passed
        :param movie_id: the id of the current movie to fetch from the database
        :return: json object containing the movie in a proper format
        """
        movie = Movies.query.filter_by(id=movie_id).first_or_404()

        if movie is None:
            abort(404, 'Sorry, we could not find any Movies to display.')

        return jsonify({
            'movie': movie.format(),
        })

    @app.route('/category/<int:category_id>', methods=['GET'])
    @cross_origin()
    @requires_auth('patch:categories')
    def get_category(payload, category_id):
        """
        GET method to fetch the category based on category_id passed
        :param category_id: the id of the current category to fetch from the database
        :return: json object containing the category
        """
        category = Category.query.filter_by(id=category_id).first_or_404()

        if category is None:
            abort(404, 'Sorry, we could not find any Categories to display.')

        return jsonify({
            'category': category.format(),
        })

    @app.route('/actor', methods=['POST'])
    @cross_origin()
    @requires_auth('post:actors')
    def new_actor(payload):
        """
        Add an Actor here
        :param payload:
        :return:
        """
        form = request.get_json(force=True)
        print(form)

        if Actors.query.filter_by(name=form['name']).first() is not None:
            abort(500, "Agent '{}' already exists...".format(
                form['name']
            ))

        try:
            new_actor = Actors(
                name=form['name'],
                gender=form['gender'],
                age=form['age'],
                joined_in=form['joined_in'],
                agent_id=form['agent_id']
            )
            new_actor.insert()
        except Exception as e:
            print(e)
            abort(500, e)

        return jsonify({
            'actor': [new_actor.format()]
        })

    @app.route('/agent', methods=['POST'])
    @cross_origin()
    @requires_auth('post:agents')
    def new_agent(payload):
        """
        Add an Agent here
        :param payload:
        :return:
        """
        form = request.get_json(force=True)
        print(form)

        if Agents.query.filter_by(name=form['name']).first() is not None:
            abort(500, "Agent '{}' already exists...".format(
                form['name']
            ))

        try:
            new_agent = Agents(
                name=form['name'],
                joined_in=form['joined_in']
            )
            new_agent.insert()
        except Exception as e:
            abort(500, e)

        return jsonify({
            'actor': [new_agent.format()]
        })

    @app.route('/category', methods=['POST'])
    @cross_origin()
    @requires_auth('post:categories')
    def new_category(payload):
        """
        Add a Category here
        :param payload:
        :return:
        """
        form = request.get_json(force=True)

        if Category.query.filter_by(name=form['name']).first() is not None:
            abort(500, 'Category {} already exists...'.format(
                form['name']
            ))

        try:
            new_category = Category(
                name=form['name']
            )
            new_category.insert()
        except Exception as e:
            abort(500, e)

        return jsonify({
            'category': [new_category.format()]
        })

    @app.route('/movie', methods=['POST'])
    @cross_origin()
    @requires_auth('post:movies')
    def new_movie(payload):
        """
        Add a Movie here
        :param payload:
        :return:
        """
        form = request.get_json(force=True)

        if Movies.query.filter_by(title=form['title']).first() is not None:
            abort(500, "Category title '{}' already exists...".format(
                form['title']
            ))

        try:
            new_movie = Movies(
                title=form['title'],
                release_date=form['release_date'],
                rating=form['rating']
            )

            categories = [Category.query.filter_by(name=category).first() for category in form['categories']]
            actors = [Actors.query.filter_by(name=actor).first() for actor in form['actors']]
            new_movie.categories = categories
            new_movie.actors = actors

            # As I am not sure how to use 'uselist', this will suffice:
            # for category in categories:
            #     new_movie.categories.append(category)
            # for actor in actors:
            #     new_movie.actors.append(actor)

            new_movie.insert()
        except Exception as e:
            abort(500, e)

        return jsonify({
            'movie': [new_movie.format()]
        })

    @app.route('/update/actor/<int:actor_id>', methods=['PATCH'])
    @cross_origin()
    @requires_auth('patch:actors')
    def update_actor(payload, actor_id):
        """
        Update an Actor here
        :param payload:
        :param actor_id:
        :return:
        """
        form = request.get_json(force=True)
        current_actor = Actors.query.filter_by(id=actor_id).first_or_404()

        if current_actor is None:
            abort(500, "Agent not found")

        try:
            current_actor.name = form['name']
            current_actor.gender = form['gender']
            current_actor.age = form['age']
            current_actor.joined_in = form['joined_in']
            current_actor.agent_id = form['agent_id']
            current_actor.update()
        except Exception as e:
            db.session.rollback()
            abort(500, e)

        return jsonify({
            'actor': [current_actor.format()]
        })

    @app.route('/update/agent/<int:agent_id>', methods=['PATCH'])
    @cross_origin()
    @requires_auth('patch:agents')
    def update_agent(payload, agent_id):
        """
        Update an Agent here
        :param payload:
        :param agent_id:
        :return:
        """
        form = request.get_json(force=True)
        current_agent = Agents.query.filter_by(id=agent_id).first_or_404()

        if current_agent is None:
            abort(500, "Agent not found")

        try:
            current_agent.name = form['name']
            current_agent.joined_in = form['joined_in']
            current_agent.update()
        except Exception as e:
            db.session.rollback()
            abort(500, e)

        return jsonify({
            'agent': [current_agent.format()]
        })

    @app.route('/update/category/<int:category_id>', methods=['PATCH'])
    @cross_origin()
    @requires_auth('patch:categories')
    def update_category(payload, category_id):
        """
        Update a Category here
        :param payload:
        :param category_id:
        :return:
        """
        form = request.get_json(force=True)
        current_category = Category.query.filter_by(id=category_id).first_or_404()

        if current_category is None:
            abort(500, "Category not found")

        try:
            current_category.name = form['name']
            current_category.update()
        except Exception as e:
            db.session.rollback()
            abort(500, e)

        return jsonify({
            'category': [current_category.format()]
        })

    @app.route('/update/movie/<int:movie_id>', methods=['PATCH'])
    @cross_origin()
    @requires_auth('patch:movies')
    def update_movie(payload, movie_id):
        """
        Update a Movie here
        :param payload:
        :param movie_id:
        :return:
        """
        form = request.get_json(force=True)
        current_movie = Movies.query.filter_by(id=movie_id).first_or_404()

        if current_movie is None:
            abort(500, "Category not found")

        try:
            current_movie.title = form['title']
            current_movie.release_date = form['release_date']
            current_movie.rating = form['rating']

            # must delete the many to many items.
            categories_delete = MoviesCategories.query.filter_by(movie_id=movie_id)
            categories_delete.delete()

            actors_delete = MoviesActors.query.filter_by(movie_id=movie_id)
            actors_delete.delete()

            categories = [Category.query.filter_by(name=category).first() for category in form['categories']]
            actors = [Actors.query.filter_by(name=actor).first() for actor in form['actors']]

            # As I am not sure how to use 'uselist', this will suffice:
            for category in categories:
                current_movie.categories.append(category)

            for actor in actors:
                current_movie.actors.append(actor)

            current_movie.update()
        except Exception as e:
            db.session.rollback()
            abort(500, e)

        return jsonify({
            'agent': [current_movie.format()]
        })

    @app.route('/actor/<int:actor_id>', methods=['DELETE'])
    @cross_origin()
    @requires_auth('delete:actors')
    def remove_actor(payload, actor_id):
        """
        Delete an Actor here
        :param payload:
        :param actor_id:
        :return:
        """
        try:
            current_actor = Actors.query.filter_by(id=actor_id).first_or_404()
            deleted = current_actor.format()

            if current_actor is None:
                abort(404)

            current_actor.delete()
            all_actors = Actors.query.order_by(Actors.id).all()
            current_actors = paginate(request, all_actors)

            return jsonify({
                'deleted': deleted,
                'actors': current_actors,
                'total_actors': len(all_actors)
            })

        except Exception as e:
            abort(422, e)

    @app.route('/agent/<int:agent_id>', methods=['DELETE'])
    @cross_origin()
    @requires_auth('delete:agents')
    def remove_agent(payload, agent_id):
        """
        Delete an Agent here
        :param payload:
        :param agent_id:
        :return:
        """
        try:
            current_agent = Agents.query.filter_by(id=agent_id).first_or_404()
            deleted = current_agent.format()

            if current_agent is None:
                abort(404)

            current_agent.delete()
            all_agents = Agents.query.order_by(Agents.id).all()
            current_agents = paginate(request, all_agents)

            return jsonify({
                'deleted': deleted,
                'agents': current_agents,
                'total_agents': len(all_agents)
            })

        except Exception as e:
            abort(422, e)

    @app.route('/category/<int:category_id>', methods=['DELETE'])
    @cross_origin()
    @requires_auth('delete:categories')
    def remove_category(payload, category_id):
        """
        Delete a Category here
        :param payload:
        :param category_id:
        :return:
        """
        try:
            current_category = Category.query.filter_by(id=category_id).first_or_404()
            deleted = current_category.format()

            if current_category is None:
                abort(404)

            current_category.delete()
            all_categories = Category.query.order_by(Category.id).all()
            current_categories = paginate(request, all_categories)

            return jsonify({
                'deleted': deleted,
                'categories': current_categories,
                'total_categories': len(all_categories)
            })

        except Exception as e:
            abort(422, e)

    @app.route('/movie/<int:movie_id>', methods=['DELETE'])
    @cross_origin()
    @requires_auth('delete:movies')
    def remove_movie(payload, movie_id):
        """
        Delete a Movie here
        :param payload:
        :param movie_id:
        :return:
        """
        try:
            current_movie = Movies.query.filter_by(id=movie_id).first_or_404()
            deleted = current_movie.format()

            if current_movie is None:
                abort(404)

            current_movie.delete()
            all_movies = Movies.query.order_by(Movies.id).all()
            current_movies = paginate(request, all_movies)

            return jsonify({
                'deleted': deleted,
                'movies': current_movies,
                'total_movies': len(all_movies)
            })

        except Exception as e:
            abort(422, e)

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


app = create_app()
port = int(os.environ.get("PORT", 8080))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
