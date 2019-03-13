import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Confiruration(object):
    DEBUG = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'test_db.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
