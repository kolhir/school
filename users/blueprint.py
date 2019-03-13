from flask import Blueprint
from . import views
users = Blueprint("users", __name__, template_folder = "templates")
