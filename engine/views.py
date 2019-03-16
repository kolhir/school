from app import app
from flask import render_template, flash, redirect, url_for,request
from flask_login import login_required
import json
import  pickle
from .models import get_scene_by_id, get_exercise_by_id
from config import url, code_template, res_code_template
import requests
# data = {"command":"scene","id":2};
# data = {"command":"exercise","id":4};
# На это рыжий кидает код(опять же еще одна команда)
# data = {"command":"code","id":4, "text": (сам код)};


@app.route("/game/command/", methods = ['POST'])
def ajax_command():
    command = get_command_from_req(request)

    if command == "scene":
        id = get_id_from_req(request)
        scene = get_scene_by_id(id)
        return scene.script

    elif command == "exercise":
        id = get_id_from_req(request)
        print("========================",id)
        exercise = get_exercise_by_id(id)
        exercise_json = fill_ex_tamplate(exercise)
        print(exercise_json)
        return exercise_json

    elif command == "code":
        ex_id = get_id_from_req(request)
        code = get_code_from_req(request)
        ex = get_exercise_by_id(ex_id)
        print(ex.io_data)
        test = go_test_code(code, ex.io_data)
        print("CODE ===========",code)
        print("code ID ======== ", ex_id)
        print("test ++++++++++++++++", test)
        return str(test).replace("\'",'\"')

@app.route("/game/ajax_test/", methods=['GET', 'POST'])
def ajax():
    print("==============")
    # create_scene()
    print(request.form["id"])
    id = request.form["id"]
    from .models import scene
    s = scene.query.filter_by(id = id).first()
    script = s.script
    #
    # try:
    #     jsonData = request.get_json(force=True)
    #     print(jsonData['id'])
    # except Exception as e:
    #     print(e)
    # d = pickle.loads(script)

    return d
    # return d

@app.route("/game")
@login_required
def game_view():
    return render_template("engine/game.htm")

def get_command_from_req(request):
    try:
        command = request.form["command"]
        return command
    except Exception as e:
        print("Нет команды ========", "Ошибка ", e)
        return 0

def get_id_from_req(request):
    try:
        id = request.form["id"]
        return id
    except Exception as e:
        print("Нет id в запросе, сорян!", e )
        return False

def get_code_from_req(request):
    try:
        code = request.form["code"]
        return code
    except Exception as e:
        print("нет кода в запросе", e)
        return False

def fill_ex_tamplate(exercise):
    ex = "{" + ex_template.format(exercise.id ,exercise.name,exercise.text,exercise.code) + "}"
    return ex

def go_test_code(code, input_io):
    code_template['Program'] = code
    res = res_code_template
    if bool(input_io):
        for item in input_io:
            code_template['Input'] = item
            r = requests.post(url, data = code_template)
            d = json.loads(r.text)
            print("d++++++++++", d)
            if not(d['Errors']):
                if d['Result'] == input_io[item]:
                    res["status"] = "success"
            else:

                res["error_text"] = d['Errors']
                print("res -------------------",res)
                res["error_text"] = res["error_text"].replace('\"',"$qv")
                res["error_text"] = res["error_text"].replace("\'","$qv")
                print("res -------------------",res)
                res["status"] = "error"
            return(res)
    else:
        r = requests.post(url, data = code_template)
        d = json.loads(r.text)
        return(d)
# ex_template = "\"name\": \"{}\",\"text\": \"{}\",\"io_data\": \"{}\",\"code\": \"{}\""
ex_template = "\"id\": \"{}\",\"name\": \"{}\",\"text\": \"{}\",\"code\": \"{}\""


# def create_scene():
#     from app import db
#     from .models import scene
#     import pickle
#     global d
#     from random import randint
#     names = "test" + str(randint(1,1000))
#     # piklscript = pickle.dumps(d)
#
#     s = scene(id = 4, name = "test2",
#                 script = d,
#                 exp_threesold = 1)
#     db.session.add(s)
#     db.session.commit()
