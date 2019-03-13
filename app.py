from flask import Flask
from config import Confiruration
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
# from users import views


app = Flask(__name__)
app.config.from_object(Confiruration)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

login = LoginManager(app)
login.login_view = 'login'
from views import index

from users.blueprint import users
app.register_blueprint(users, url_prefix = "/")

from engine.blueprint import engine
app.register_blueprint(engine, url_prefix = "/game")


# from users import models, views
