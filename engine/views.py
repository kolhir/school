from app import app
from flask import render_template, flash, redirect, url_for
from flask_login import login_required


@app.route("/game")
@login_required
def game_view():
    return render_template("engine/game.htm")
