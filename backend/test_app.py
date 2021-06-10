import unittest
import json
from flask_sqlalchemy import SQLAlchemy

import config
from app import create_app, setup_db


class CastingTestCase(unittest.TestCase):
    """This class represents the Casting test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app(config_file=config.TestConfig)
        self.client = self.app.test_client
        self.database_name = "casting_test"
        setup_db(self.app)

        self.valid_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImxwaS1qOVJZbEV0MkJ0U0dUbFFKOSJ9.eyJpc3MiOiJodHRwczovL2ZlcnJlaXJhdGVjaC5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjBiN2Y0NDRmNWU3MTcwMDZhYTBlZTc4IiwiYXVkIjpbImZlcnJlaXJhdGVjaCIsImh0dHBzOi8vZmVycmVpcmF0ZWNoLmV1LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2MjMzNDMyMTksImV4cCI6MTYyMzQyOTYxOSwiYXpwIjoiNGROR3hlN2lid3c3MUJveFd4ZWgxcWpURDdFYjJGTlYiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwicGVybWlzc2lvbnMiOlsiZGVsZXRlOmFjdG9ycyIsImRlbGV0ZTphZ2VudHMiLCJkZWxldGU6Y2F0ZWdvcmllcyIsImRlbGV0ZTptb3ZpZXMiLCJnZXQ6YWN0b3JzIiwiZ2V0OmFnZW50cyIsImdldDpjYXRlZ29yaWVzIiwiZ2V0Om1vdmllcyIsInBhdGNoOmFjdG9ycyIsInBhdGNoOmFnZW50cyIsInBhdGNoOmNhdGVnb3JpZXMiLCJwYXRjaDptb3ZpZXMiLCJwb3N0OmFjdG9ycyIsInBvc3Q6YWdlbnRzIiwicG9zdDpjYXRlZ29yaWVzIiwicG9zdDptb3ZpZXMiXX0.nqqN5JJCO2FUZoY8ZTWDj5dIuHchzDqkXZLQvz3iHIxUQc8PuPuy57KYyi71kRg5tfOZV6pCW38hS8ApM4nkvo1RY0OAjM3_rRyQ6LNwxvyTHY44-F1_oNudlqxmstjXrG2zFCHmh_mhL-T0to5dkSEcwbYo35ep_8u2n4QhtWvsPN30QTAcw6lsMyoWu1mSXW9bTDgF0DsT4CbJlnK0UlKYJm8DK0HOnvIHSm70hdpuRpg3beSLO_SKznjdMwfbhUyndr3MYROqbQ20xf-ugR1N9JMfkfvdD3FZ4sdTHczIsvi3pKEzK2zS1NlHRyc5M20Vp0TMTyvVebZyW6pMyQ'
        self.invalid_token = 'iamaninvalidtoken'

        self.new_category = {
            'name': "Test"
        }

        self.existing_category = {
            'name': 'drama'
        }

        self.update_category = {
            'name': "Test_updated"
        }

        self.new_agent = {
            "name": "Agent Test Case",
            "joined_in": "2020-06-09"
        }

        self.update_agent = {
            "name": "Agent Test Case Updated",
            "joined_in": "2020-06-09"
        }

        self.new_actor = {
            "name": "Steven Testing",
            "gender": "Male",
            "age": 45,
            "joined_in": "2020-06-09",
            "agent_id": 2
        }

        self.updated_actor = {
            "name": "Steven Testing Updated",
            "gender": "Male",
            "age": 45,
            "joined_in": "2020-06-09",
            "agent_id": 2
        }

        self.new_movie = {
            "actors": [
                "Charlie Tuff"
            ],
            "categories": [
                "drama"
            ],
            "rating": 9,
            "release_date": "2021-06-09",
            "title": "Movie Test"
        }

        self.updated_movie = {
            "actors": [
                "Charlie Tuff"
            ],
            "categories": [
                "drama"
            ],
            "rating": 9,
            "release_date": "2021-06-09",
            "title": "Movie Test Updated"
        }

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)

            # create all tables
            self.db.create_all()

    def tearDown(self):
        """Executed after reach test"""
        pass

    def test_movies(self):
        """ Test method for movies """
        res_get_movies = self.client().get('/movies', headers={'Authorization': 'Bearer ' + self.valid_token})

        # as test database has no movies, it returns 404 as expected
        self.assertEqual(res_get_movies.status_code, 404)

        res_new_movie = self.client().post('/movie',
                                           data=json.dumps(self.new_movie),
                                           headers={
                                               'Authorization': 'Bearer ' + self.valid_token,
                                               'Content-Type': 'application/json'
                                           })
        self.assertEqual(res_new_movie.status_code, 200)

        res_ex_movie = self.client().post('/movie',
                                          data=json.dumps(self.new_movie),
                                          headers={
                                              'Authorization': 'Bearer ' + self.valid_token,
                                              'Content-Type': 'application/json'
                                          })
        # First will fail as expects a 500, as category already exists.
        self.assertEqual(res_ex_movie.status_code, 200)
        self.assertEqual(res_ex_movie.status_code, 500)

        res_update_movie = self.client().patch('/update/movie/1',
                                               data=json.dumps(self.updated_movie),
                                               headers={
                                                   'Authorization': 'Bearer ' + self.valid_token,
                                                   'Content-Type': 'application/json'
                                               })
        data_update_movie = json.loads(res_update_movie.data)
        self.assertNotEqual(data_update_movie['movie'][0]['title'], "Movie Test")

        res_delete_movie = self.client().delete('/movie/1',
                                                headers={
                                                    'Authorization': 'Bearer ' + self.valid_token,
                                                    'Content-Type': 'application/json'
                                                })
        data_delete_movie = json.loads(res_delete_movie.data)
        # print('movie deleted', data_delete_movie['deleted']['title'])
        self.assertNotEqual(data_delete_movie['deleted']['title'], "Movie Test")

    def test_agents(self):
        """ Test method for agents """
        res_get_agents = self.client().get('/agents', headers={'Authorization': 'Bearer ' + self.valid_token})
        data_get_agents = json.loads(res_get_agents.data)

        self.assertEqual(res_get_agents.status_code, 200)
        self.assertTrue(data_get_agents['agents'])
        self.assertTrue(data_get_agents['total_agents'])

        res_new_agent = self.client().post('/agent',
                                           data=json.dumps(self.new_agent),
                                           headers={
                                               'Authorization': 'Bearer ' + self.valid_token,
                                               'Content-Type': 'application/json'
                                           })
        self.assertEqual(res_new_agent.status_code, 200)

        res_ex_agent = self.client().post('/agent',
                                          data=json.dumps(self.new_agent),
                                          headers={
                                              'Authorization': 'Bearer ' + self.valid_token,
                                              'Content-Type': 'application/json'
                                          })
        # First will fail as expects a 500, as category already exists.
        self.assertEqual(res_ex_agent.status_code, 200)
        self.assertEqual(res_ex_agent.status_code, 500)

        res_update_agent = self.client().patch('/update/agent/3',
                                               data=json.dumps(self.update_agent),
                                               headers={
                                                   'Authorization': 'Bearer ' + self.valid_token,
                                                   'Content-Type': 'application/json'
                                               })
        data_update_agent = json.loads(res_update_agent.data)
        # print('update agent', data_update_agent['agent'][0]['name'])
        self.assertEqual(data_update_agent['agent'][0]['name'], "Agent Test Case")

        res_delete_agent = self.client().delete('/agent/3',
                                                headers={
                                                    'Authorization': 'Bearer ' + self.valid_token,
                                                    'Content-Type': 'application/json'
                                                })
        data_delete_agent = json.loads(res_delete_agent.data)
        # print('deleted_agent', data_delete_agent['deleted']['name'])
        self.assertNotEqual(data_delete_agent['deleted']['name'], "Agent Test Case Updated")

    def test_actors(self):
        """ Test method for actors """
        res_get_actors = self.client().get('/actors', headers={'Authorization': 'Bearer ' + self.valid_token})
        data_get_actors = json.loads(res_get_actors.data)

        self.assertEqual(res_get_actors.status_code, 200)
        self.assertTrue(data_get_actors['actors'])
        self.assertTrue(data_get_actors['total_actors'])

        res_new_actor = self.client().post('/actor',
                                           data=json.dumps(self.new_actor),
                                           headers={
                                               'Authorization': 'Bearer ' + self.valid_token,
                                               'Content-Type': 'application/json'
                                           })
        self.assertEqual(res_new_actor.status_code, 200)

        res_ex_actor = self.client().post('/actor',
                                          data=json.dumps(self.new_actor),
                                          headers={
                                              'Authorization': 'Bearer ' + self.valid_token,
                                              'Content-Type': 'application/json'
                                          })
        # First will fail as expects a 500, as actor already exists.
        self.assertEqual(res_ex_actor.status_code, 200)
        self.assertEqual(res_ex_actor.status_code, 500)

        res_update_actor = self.client().patch('/update/actor/4',
                                               data=json.dumps(self.updated_actor),
                                               headers={
                                                   'Authorization': 'Bearer ' + self.valid_token,
                                                   'Content-Type': 'application/json'
                                               })
        data_update_actor = json.loads(res_update_actor.data)
        # print('actor', data_update_actor['actor'][0]['name'])
        self.assertNotEqual(data_update_actor['actor'][0]['name'], "Steven Testing")

        res_delete_actor = self.client().delete('/actor/4',
                                                headers={
                                                    'Authorization': 'Bearer ' + self.valid_token,
                                                    'Content-Type': 'application/json'
                                                })
        data_delete_actor = json.loads(res_delete_actor.data)
        # print('delete actor', data_delete_actor['deleted']['name'])
        self.assertEqual(data_delete_actor['deleted']['name'], "Steven Testing Updated")

    def test_categories(self):
        """Test method for categories"""

        res_get_categories = self.client().get('/categories', headers={'Authorization': 'Bearer ' + self.valid_token})
        data_get_categories = json.loads(res_get_categories.data)

        self.assertEqual(res_get_categories.status_code, 200)
        self.assertTrue(data_get_categories['categories'])
        self.assertTrue(data_get_categories['total_categories'])
        self.assertIsNotNone(data_get_categories)

        res_new_category = self.client().post('/category',
                                              data=json.dumps(self.new_category),
                                              headers={
                                                  'Authorization': 'Bearer ' + self.valid_token,
                                                  'Content-Type': 'application/json'
                                              })
        self.assertEqual(res_new_category.status_code, 200)

        res_ex_category = self.client().post('/category',
                                             data=json.dumps(self.existing_category),
                                             headers={
                                                 'Authorization': 'Bearer ' + self.valid_token,
                                                 'Content-Type': 'application/json'
                                             })
        # First will fail as expects a 500, as category already exists.
        # self.assertEqual(res_ex_category.status_code, 200)
        self.assertEqual(res_ex_category.status_code, 500)

        res_update_category = self.client().patch('/update/category/6',
                                                  data=json.dumps(self.update_category),
                                                  headers={
                                                      'Authorization': 'Bearer ' + self.valid_token,
                                                      'Content-Type': 'application/json'
                                                  })
        data_update_category = json.loads(res_update_category.data)
        # print('updated category', data_update_category['category'][0]['name'])
        self.assertNotEqual(data_update_category['category'][0]['name'], "Test")

        res_delete_category = self.client().delete('/category/6',
                                                   headers={
                                                       'Authorization': 'Bearer ' + self.valid_token,
                                                       'Content-Type': 'application/json'
                                                   })
        data_delete_category = json.loads(res_delete_category.data)
        # print('delete category', data_delete_category['deleted']['name'])
        self.assertNotEqual(data_delete_category['deleted']['name'], "Test")

    def test_invalid_token(self):
        """Test method with invalid token"""

        res_get_categories = self.client().get('/categories', headers={'Authorization': 'Bearer ' + self.invalid_token})
        self.assertEqual(res_get_categories.status_code, 500)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
