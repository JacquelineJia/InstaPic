import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    CORS_HEADERS = os.environ.get('CORS_HEADERS') or 'Content-Type'
    DEBUG = os.environ.get('DEBUG') or False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'jacqueline_is_cool'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'api.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False