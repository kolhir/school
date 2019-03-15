from app import db
from users.models import User

class Scene(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)
    script = db.Column(db.Text)
    exp_threesold = db.Column(db.Integer)

class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)
    text = db.Column(db.Text)
    io_data = db.Column(db.Text, index=True, unique=True)
    code = db.Column(db.Text)
    scene_id = db.Column(db.Integer, db.ForeignKey('scene.id'),
                            nullable=False)

exercise_has_user = db.Table("exercise_has_user",
    db.Column('user_id', db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column('exercise_id', db.Integer, db.ForeignKey("exercise.id"), primary_key=True)
)

def get_scene_by_id(id):
    scene = Scene.query.filter_by(id = id).first()
    if scene:
        return scene
    else:
        print("db errrrror нет сцены с таким id")

def get_exercise_by_id(id):
    exercise = Exercise.query.filter_by(id = id).first()
    if exercise:
        return exercise
    else:
        print("db errrrror нет упражнения с таким id")
