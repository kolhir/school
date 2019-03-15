from flask import Blueprint
from . import views
from . import models
engine = Blueprint("engine", __name__, template_folder = "templates", static_folder='static')
