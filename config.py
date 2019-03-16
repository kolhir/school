import os

basedir = os.path.abspath(os.path.dirname(__file__))
url = "https://rextester.com/rundotnet/api"

code_template = {
'LanguageChoiceWrapper' : '24',
'Program':
'''
''',
'Input':''
}

res_code_template ={
"status":"",
"error_text":"",
}
class Confiruration(object):
    DEBUG = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'test_db.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
