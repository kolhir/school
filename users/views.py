from app import app, db
from flask import render_template, flash, redirect, url_for,request
from werkzeug.urls import url_parse
from flask_login import logout_user
from flask_login import current_user, login_user
from .models import User
from .forms import LoginForm, RegistrationForm

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Не правильные логин или пароль')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('users/login.html', title='Вход', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('users/register.html', title='Регистрация', form=form)


def new_user_tg_send(login,number):
    with TelegramClient('psevdoworld', 836895, '9523c24ea9a61036070c9b0a2b324454') as client:
        client.start()
        client.send_message('schoolworld42', 'new,'+login+','+number)

def send_event(event,login):
    with TelegramClient('psevdoworld', 836895, '9523c24ea9a61036070c9b0a2b324454') as client:
        client.start()
        client.send_message('schoolworld42', (event+ ',' +login) )
