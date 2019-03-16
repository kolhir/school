from flask import Flask, render_template
from config import Confiruration
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
# from users import views


app = Flask(__name__)
app.config.from_object(Confiruration)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
Bootstrap(app)

login = LoginManager(app)
login.login_view = 'login'
from views import indext

from users.blueprint import users
app.register_blueprint(users, url_prefix = "/")

from engine.blueprint import engine
app.register_blueprint(engine, url_prefix = "/game")


@app.route("/test")
def test():
    return render_template("test.html")
# from users import models, views
