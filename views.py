from app import app
from flask import render_template, flash, redirect, url_for


@app.route("/index")
def indext():
    return render_template("test.html")
