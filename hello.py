from flask import Flask, request, render_template
import json

app = Flask(__name__)
app.debug = True


@app.route("/")
def hello():
    return render_template('index.htm')

@app.route("/ajax_test/", methods=['GET', 'POST'])
def ajax():
    print("request",request.args)
    d = {"hello":42}
    return json.dumps(d)

if __name__ == "__main__":
    app.run("192.168.1.171")
