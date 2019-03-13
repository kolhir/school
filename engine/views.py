from app import app
from flask import render_template, flash, redirect, url_for
from flask_login import login_required

import  pickle

@app.route("/game")
@login_required
def game_view():
    return render_template("engine/game.htm")

@app.route("/ajax_test/", methods=['GET', 'POST'])
def ajax():
    # create_scene()

    try:
        jsonData = request.get_json()
        print(jsonData['script'])
    except Exception as e:
        print(e)

    d = {"hello":42}
    return json.dumps(d)

def create_scene():
    from .models import scene
    import pickle
    global d
    from random import randint
    names = "test" + str(randint(1,1000))
    piklscript = pickle.dumps(d)
    s = scene(id = 1, name = "test2",
                script = piklscript,
                exp_threesold = 1)
    db.session.add(s)
    db.session.commit()
d = """{
    'resources':{
        'imgs': {
            'ch1': '{{url_for("engine.static",filename="tan_engine/ch_giselle1.png")}}',
            'ch2': '{{url_for("engine.static",filename="tan_engine/ch_vel1.png")}}',
            'ch2_big': '{{url_for("engine.static",filename="tan_engine/ahhhh.png")}}',
            'sc1': '{{url_for("engine.static",filename="tan_engine/sc_room.jpg")}}',
            'sc2': '{{url_for("engine.static",filename="tan_engine/sc_kitchen.jpg")}}',
            'end': '{{url_for("engine.static",filename="tan_engine/the_end.png")}}'
        }
    },
    'script':[
        ['scene',{'img':'sc1'}],
        ['char',{'img':'ch1', 'position':'center'}],
        ['say',{'char':'незнакомка', 'text':'Доброе утро, меня зовут Джизель. Я пришла к вам домой для демонстрации нашего нового движка для визуальных новел.'}],
        ['say',{'char':'Джизель', 'text':'А? Что?! Постойте, как убраться из вашего дома?! Пусть наш движок еще пока и не идеален, он уже достаточно мощный чтобы городо нести имя "Движок для визуальных новел"!'}],
        ['say',{'char':'Джизель', 'text':'Пройдем на кухню, там пройдет основная презентация :)'}],
        ['send_request',{'url':'http://www.volpi.ru',
            'method':'GET',
            'data':null}],
        ['label','l1'],
        ['menu',[
                {'text':'Согласится', 'to':'l3'},
                {'text':'Отказать', 'to':'l2'}
        ]],
        ['label','l2'],
        ['say',{'char':'Джизель', 'text':'Да не ломайся ты!'}],
        ['to','l1'],
        ['label','l3'],
        ['scene',{'img':'sc2'}],
        ['char',{'img':'ch1', 'position':'left'}],
        ['say',{'char':'Джизель', 'text':'Вот мы и очутились на кухне. Не впечатлило?'}],
        ['say',{'char':'Джизель', 'text':'Тогда я готова вам продемонстрировать кое-что по настоящему интересное.'}],
        ['say',{'char':'Джизель', 'text':'Для этого мне понадобится помощь моей ассистентки.'}],
        ['say',{'char':'Джизель', 'text':'Джузеппо!!!'}],
        ['char',{'img':'ch2', 'position':'right'}],
        ['say',{'char':'Джузеппо', 'color':'blue', 'text':'Вызывали?'}],
        ['say',{'char':'Джизель', 'text':'Передаю слово тебе, Джузеппо.'}],
        ['scene',{'img':'sc2'}],
        ['char',{'img':'ch2', 'position':'center'}],
        ['say',{'char':'Джузеппо', 'color':'blue', 'text':'Короче, либо ты покупаешь движок, либо я убью тебя прямо тут. И никто тебе не поможет.'}],
        ['char',{'img':'ch2_big', 'position':'center'}],
        ['say',{'char':'Джузеппо', 'color':'blue', 'text':'Никто...'}],
        ['scene',{'img':'end'}],
]}"""
