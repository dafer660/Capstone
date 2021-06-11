# Udacity Capstone Backend using Flask

------------

## Introduction

With this backend you should be able to:

- ``GET``, ``PATCH`` and ``POST`` Actors (that can be assigned to Movies).
- ``GET``, ``PATCH`` and ``POST`` Agents (that represent Actors).
- ``GET``, ``PATCH`` and ``POST`` movie Categories (that can be assigned to Movies).
- ``GET``, ``PATCH`` and ``POST`` Movies (that can have many Actors and Categories).

## Pre-requisites and Local Development

Developers using this project should already have Python3 and pip installed on their local machines.

From the backend folder run pip install requirements.txt. All required packages are included in the requirements file.

### Installing Dependencies

##### Python 3.9

Follow instructions to install the latest version of python for your platform in
the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/ "docs") Virtual
Environment.

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for
each project separate and organized. Instructions for setting up a virtual environment for your platform can be found in
the python docs

##### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by navigating to the /backend directory
and running:

``pip install -r requirements.txt``

This will install all of the required packages we selected within the ``requirements.txt`` file.

#### Key Dependencies

- [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work
  in app.py and can reference models.py.

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server.

## Database Setup

### Development

- Start by creating the database running the command
``createdb -U postgres casting``.
  
- Then you can simply run the script ``psql -U <USER> -h localhost -d casting -a -f 'casting.sql'`` and the database will have some default data in it.

### Production

- If the app is already created and the Postgres Database is already present as add-on in your app, simply run ``heroku pg:psql <DB NAME> --app <APP NAME> < default.sql`` and it will generate the same default data.

- In the case you don't have a Postgres database attached to your app, you can do so by running the following command ``heroku addons:attach heroku-postgresql -a <APP_NAME>``.

- On a small note, make sure to run the following commands as it will ensure you Migrate your database properly
````python
flask db init
flask db migrate -m "1st migration"
````

- Then you can simply upgrade the database on heroku by running ``heroku run flask db upgrade`` and it will migrate/upgrade your database.

NOTE: be sure to remove the migrations folder from your ```.gitignore``` file.

## Running Tests

Tests can be run with the python file ```test_app.py```

### Development

For tests to run properly, we need to setup the test database, by running the following sequence of commands
````python
dropdb -U postgres casting_test
createdb -U postgres casting_test
psql -d casting_test -U postgres -f casting_test.sql
python test_app.py
````

NOTES:
- Make sure you run these commands on the root folder of the ``backend`` folder.
- The above commands assume you are using the user ``postgres`` to create and drop the databases.

### Production

- Create a second Postgres addon: ``heroku addons:create heroku-postgresql --app <APP NAME>``.
- Check which addons we have ready, ``heroku addons --app <APP NAME>`` and we can get the name of the database.
- Create the tables and add the dummy data ``heroku pg:psql <DB NAME> --app <APP NAME> < casting_test.sql``.
- In case you already have a database you can use, simply wipe the database ``heroku pg:reset <DB NAME> --confirm <APP NAME>`` and re-run the command above.
- We can run the ``python test_app.py`` within our app now with ``heroku run bash --app <APP NAME>``

## Running the Server

### Development

```python
set FLASK_APP=flaskr
set FLASK_ENV=development
flask run
```

The application should run on [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

### Production

- Make sure you create a ``Procfile`` with the following ``web: gunicorn app:app`` in order to run the server on [Heroku](https://www.heroku.com/).
- You will also need to create a ``setup.sh`` file where you need to export your database that you attached, ``export DATABASE_URL=<DB NAME>``. You can get the ``DB NAME`` in your dashboard.

## API Reference

### Getting Started

**Authentication**: This version of the application requires authentication and it is handled by Auth0 in the frontend when requests are made to the Backend API.

## Error Handling

Errors are returned as JSON objects in the following format, with an example below for code error ``400``:


````python
    @app.errorhandler(400)
    def bad_reques(error):
        return jsonify({
            'message': error.description,
            'error': 400,
            'success': False
        }), 400
````

The API will return the following error types when requests fail:
````python
400: Bad Request
401: Unauthorized
404: Resource Not Found
405: Method Not Allowed
422: Not Processable
500: Internal Server Error
````

## Endpoints

###### NOTE:
All endpoints at this point require a **valid JWT** token generated by Auth0, so if you are using ``Postman`` or ``Curl``, make sure to include one in your ``Authorization Header``.

#### GET ``/agents``
- General:
    - used to return a JSON object with all the agents (paginated).
- Authentication:
    - requires the role ``get:agents``
- Sample:
````json
{
    "agents": [
        {
            "id": 1,
            "joined_in": "Wed, 01 May 2019 00:00:00 GMT",
            "name": "Susan Percival"
        },
        {
            "id": 2,
            "joined_in": "Wed, 01 May 2019 00:00:00 GMT",
            "name": "Harry Lee"
        }
    ],
    "total_agents": 2
}
````

#### GET ``/actors``
- General:
    - used to return a JSON object with all the actors (paginated).
- Authentication:
    - requires the role ``get:actors``
- Sample:
````json
{
    "actors": [
        {
            "age": 30,
            "agent": "Susan Percival",
            "agent_id": 1,
            "gender": "Male",
            "id": 2,
            "joined_in": "Wed, 01 May 2019 00:00:00 GMT",
            "name": "Charlie Tuff"
        },
        {
            "age": 27,
            "agent": "Harry Lee",
            "agent_id": 2,
            "gender": "Female",
            "id": 3,
            "joined_in": "Wed, 01 May 2019 00:00:00 GMT",
            "name": "Ana Torres"
        }
    ],
    "latest_actors": [
        {
            "age": 30,
            "agent": "Susan Percival",
            "agent_id": 1,
            "gender": "Male",
            "id": 2,
            "joined_in": "Wed, 01 May 2019 00:00:00 GMT",
            "name": "Charlie Tuff"
        },
        {
            "age": 27,
            "agent": "Harry Lee",
            "agent_id": 2,
            "gender": "Female",
            "id": 3,
            "joined_in": "Wed, 01 May 2019 00:00:00 GMT",
            "name": "Ana Torres"
        }
    ],
    "total_actors": 2
}
````

#### GET ``/categories``
- General:
    - used to return a JSON object with all the categories (paginated).
- Authentication:
    - requires the role ``get:categories``
- Sample:
````json
{
    "categories": [
        {
            "id": 1,
            "name": "drama"
        },
        {
            "id": 2,
            "name": "comedy"
        },
        {
            "id": 3,
            "name": "action"
        },
        {
            "id": 4,
            "name": "thriller"
        },
        {
            "id": 5,
            "name": "horror"
        }
    ],
    "total_categories": 5
}
````

#### GET ``/movies``
- General:
    - used to return a JSON object with all the movies (paginated).
- Authentication:
    - requires the role ``get:movies``
- Sample:
````json
{
    "movies": [
        {
            "actors": [
                "Charlie Tuff",
                "Ana Torres"
            ],
            "categories": [
                "drama",
                "comedy"
            ],
            "id": 1,
            "rating": 8,
            "release_date": "Fri, 04 Jun 2021 00:00:00 GMT",
            "title": "The good guy"
        }
    ],
    "total_movies": 1
}
````
  
#### GET ``/agent/<int:agent_id>``
- General:
    - used to return a JSON object with all the agent with the specified ``agent_id``.
- Authentication:
    - requires the role ``patch:agents`` as it will be used to populate the Form in the front end to update the Agent.
- Sample:
````json
{
    "agent": {
        "id": 1,
        "joined_in": "Wed, 01 May 2019 00:00:00 GMT",
        "name": "Susan Percival"
    }
}
````
  
#### GET ``/actor/<int:actor_id>``
- General:
    - used to return a JSON object with all the actor with the specified ``actor_id``.
- Authentication:
    - requires the role ``patch:actors`` as it will be used to populate the Form in the front end to update the Actor.
- Sample:
````json
{
    "actor": {
        "age": 30,
        "agent": "Susan Percival",
        "agent_id": 1,
        "gender": "Male",
        "id": 2,
        "joined_in": "Wed, 01 May 2019 00:00:00 GMT",
        "name": "Charlie Tuff"
    }
}
````

#### GET ``/category/<int:category_id>``
- General:
    - used to return a JSON object with all the actor with the specified ``category_id``.
- Authentication:
    - requires the role ``patch:categories`` as it will be used to populate the Form in the front end to update the Category.
- Sample:
````json
{
    "category": {
        "id": 1,
        "name": "drama"
    }
}
````
  
#### GET ``/movie/<int:movie_id>``
- General:
    - used to return a JSON object with all the actor with the specified ``movie_id``.
- Authentication:
    - requires the role ``patch:movies`` as it will be used to populate the Form in the front end to update the Movie.
- Sample:
````json
{
    "movie": {
        "actors": [
            "Charlie Tuff",
            "Ana Torres"
        ],
        "categories": [
            "comedy",
            "drama"
        ],
        "id": 1,
        "rating": 8,
        "release_date": "Fri, 04 Jun 2021 00:00:00 GMT",
        "title": "The good guy"
    }
}
````
  
#### POST ``/agent``
- General:
    - used to create a new agent and returns a JSON object with newly created agent.
- Authentication:
    - requires the role ``post:agents``.
- Required Data:
````json
{
    "name": "Agent 2",
    "joined_in": "2020-06-09"
}
````
  
#### POST ``/actor``
- General:
    - used to create a new actor and returns a JSON object with newly created actor.
- Authentication:
    - requires the role ``post:actors``.
- Required Data:
````json
{
    "name": "Steven Hallman",
    "gender": "Male",
    "age": 45,
    "joined_in": "2020-06-09",
    "agent_id": 2
}
````
  
#### POST ``/category``
- General:
    - used to create a new category and returns a JSON object with newly created category.
- Authentication:
    - requires the role ``post:categories``.
- Required Data:
````json
{
    "name": "Category unknown"
}
````
  
#### POST ``/movie``
- General:
    - used to create a new movie and returns a JSON object with newly created movie.
- Authentication:
    - requires the role ``post:movies``.
- Required Data:
````json
{
    "actors": [
        "Steven Hallman"
    ],
    "categories": [
        "Drama"
    ],
    "rating": 9,
    "release_date": "2021-06-09",
    "title": "The Halls of Men"
}
````
  
#### PATCH ``/update/agent/<int:agent_id>``
- General:
    - used to update an agent and returns a JSON object with updated agent.
- Authentication:
    - requires the role ``patch:agents``.
- Required Data:
````json
{
    "name": "Soren Hill",
    "joined_in": "2020-07-09"
}
````
  
#### PATCH ``/update/actor/<int:actor_id>``
- General:
    - used to update an actor and returns a JSON object with updated actor.
- Authentication:
    - requires the role ``patch:actors``.
- Required Data:
````json
{
    "name": "Melina Silva",
    "gender": "Female",
    "age": 34,
    "joined_in": "2020-07-09",
    "agent_id": 2
}
````
  
#### PATCH ``/update/category/<int:category_id>``
- General:
    - used to update a category and returns a JSON object with updated category.
- Authentication:
    - requires the role ``patch:categories``.
- Required Data:
````json
{
    "name": "Sci-fi"
}
````
  
#### PATCH ``/update/movie/<int:movie_id>``
- General:
    - used to update a movie and returns a JSON object with updated movie.
- Authentication:
    - requires the role ``patch:movies``.
- Required Data:
````json
{
    "title": "Title Unknown",
    "release_date": "2020-06-09",
    "rating": 1,
    "categories": [
        "Horror"
    ],
    "actors": [
      "Steven Hallman"
    ]
}
````
  
#### DELETE ``/agent/<int:agent_id>``
- General:
    - used to delete an agent and returns a JSON object with the deleted agent, all the agents (paginated) and the total agents (the length).
- Authentication:
    - requires the role ``delete:agents``.
  
#### DELETE ``/actor/<int:actor_id>``
- General:
    - used to delete an actor and returns a JSON object with the deleted actor, all the actors (paginated) and the total actors (the length).
- Authentication:
    - requires the role ``delete:actors``.
  
#### DELETE ``/category/<int:category_id>``
- General:
    - used to delete a category and returns a JSON object with the deleted category, all the categories (paginated) and the total categories (the length).
- Authentication:
    - requires the role ``delete:categories``.
  
#### DELETE ``/movie/<int:movie_id>``
- General:
    - used to delete a movie and returns a JSON object with the deleted movie, all the movies (paginated) and the total movies (the length).
- Authentication:
    - requires the role ``delete:movies``.
