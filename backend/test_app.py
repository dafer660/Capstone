
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flask_ import create_app, setup_db
from backend import config


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app(config_file=config.TestConfig)
        self.client = self.app.test_client
        self.database_name = "trivia_test"
        setup_db(self.app)

        self.new_question = {
            'question': 'Is automation the next big thing?',
            'answer': 'Most likely',
            'category': 1,
            'difficulty': 1,
            'rating': 1
        }

        self.new_category = {
            'type': "test"
        }

        self.new_user = {
            'username': "trivia_test",
            'password': "password",
            'repeat_password': "password"
        }

        self.login_user = {
            'username': "trivia",
            'password': "trivia",
        }

        self.new_search = {
            'searchTerm': 'giaconda'
        }

        self.quiz = {
            'previous_questions': [],
            'quiz_category':
                {"type": "", "id": 0}
        }

        self.save_score = {
            "user":
                {"username": "trivia"},
            "num_correct": 1
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

    def test_get_categories(self):
        """Test GET method for categories"""

        res_categories = self.client().get('/categories')
        data_categories = json.loads(res_categories.data)

        self.assertEqual(res_categories.status_code, 200)
        self.assertTrue(data_categories['categories'])
        self.assertTrue(data_categories['total_categories'])
        self.assertIsNotNone(data_categories)

    def test_new_question(self):
        """Test add a new question """
        res_question = self.client().post('/question',
                                          data=json.dumps(self.new_question),
                                          headers={'Content-Type': 'application/json'})
        data_question = json.loads(res_question.data)

        self.assertEqual(data_question['answer'], 'Most likely')
        self.assertNotEqual(data_question['rating'], 2)

    def test_delete_question(self):
        """Test delete a question """

        res_questions = self.client().delete('/questions/2')
        data_questions = json.loads(res_questions.data)

        self.assertEqual(res_questions.status_code, 200)
        self.assertTrue(data_questions['total_questions'] > 0)
        self.assertIsNotNone(data_questions)

    def test_register(self):
        """Test register user method """
        res_register = self.client().post('/register',
                                          data=json.dumps(self.new_user),
                                          headers={'Content-Type': 'application/json'})
        data_register = json.loads(res_register.data)

        self.assertEqual(data_register['status'], 200)
        self.assertTrue(data_register['registered'])

    def test_login(self):
        """
        Test login user method and save score
        As we need a token to save the score, I do it here
        """
        res_login = self.client().post('/login',
                                       data=json.dumps(self.login_user),
                                       headers={'Content-Type': 'application/json'})
        data_login = json.loads(res_login.data)

        res_save_score = self.client().post('/save_score',
                                            data=json.dumps(self.save_score),
                                            headers={
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer {}'.format(data_login['token'])
                                            })
        data_save_score = json.loads(res_save_score.data)

        self.assertIsNotNone(data_login['token'])
        self.assertTrue(data_login['authenticated'])
        self.assertEqual(data_save_score['message'], 'score saved')

    def test_search_question(self):
        """Test a search for questions """

        res_search = self.client().post('/questions',
                                        data=json.dumps(self.new_search),
                                        headers={'Content-Type': 'application/json'})
        data_search = json.loads(res_search.data)

        self.assertIsNotNone(data_search)
        self.assertEqual(data_search['questions'][0]['id'], 17)
        self.assertEqual(data_search['total_questions'], 1)

    def test_quiz(self):
        """Test a quiz """

        res_quiz = self.client().post('/quizzes',
                                      data=json.dumps(self.quiz),
                                      headers={'Content-Type': 'application/json'})
        data_quiz = json.loads(res_quiz.data)

        self.assertIsNotNone(data_quiz)
        self.assertGreaterEqual(len(data_quiz['previousQuestions']), 0)
        self.assertIsNotNone(data_quiz['question'])


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
