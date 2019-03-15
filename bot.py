import telebot
bot = telebot.TeleBot("801072262:AAFLvQJ9q6xxk2BMc5u5t3k5EJCS6wrhdwQ", threaded=False)
import json
import requests
import time
import traceback
url = "https://rextester.com/rundotnet/api"

data = {
'LanguageChoiceWrapper' : '24',
'Program':
'''
{}
''',
'Input':''
}

@bot.message_handler(content_types=['text'])
def handle_text(message):
    print("======")
    k = message.from_user
    res = go_python(message.text)
    if not(res['Errors']):
        mes = res['Result']
    else:
        mes = res['Errors']

    print(k.id, ";  Имя: ", k.first_name, ";  Фамилия: ", k.last_name, "; User_name: ", k.username, "\n", "Сообщение от пользователя: \n", message.text, "\n", sep = "")
    print("============ ", mes[:500])
    if len(mes)>4000:
        mes = mes[:4000] + "............message...so...long....sorry.........\n8======================D"
        print(" User_name: ", k.username, "Этот пользователь только что получил член")
    elif len(mes) == 0:
        mes = "no output, go fuck yourself"
        print(" User_name: ", k.username, "Этот пользователь только что получил пустое сообщение")
    bot.send_message(message.from_user.id, mes)

def go_python(message):
    data['Program'] = message
    r = requests.post(url, data = data)
    d = json.loads(r.text)
    return(d)

while True:
    try:
        bot.polling(none_stop=True)
    except Exception as e:
        print("Ошибка: ",e)
        traceback.print_exc()
        time.sleep(15)
