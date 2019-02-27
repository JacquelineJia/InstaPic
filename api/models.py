from api import db, login
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    posts = db.relationship('Post', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        data = {
            'id': self.id,
            'username': self.username
        }
        return data

    def from_dict(self, data):
        if 'username' in data:
            setattr(self, 'username', data['username'])
        if 'password' in data:
            self.set_password(data['password'])

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(140))
    description = db.Column(db.String(140))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    comments = db.relationship('Comment', backref='post', lazy='dynamic')

    def __repr__(self):
        return '<Post {}>'.format(self.description)

    def to_dict(self):
        data = {
            'id': self.id,
            'image': self.image,
            'description': self.description,
            'user_id': self.user_id
        }
        return data

    def from_dict(self, data):
        for field in ['image', 'description', 'user_id']:
            if field in data:
                setattr(self, field, data[field])

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(140))
    content = db.Column(db.String(140))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))

    def __repr__(self):
        return '<Comment {}>'.format(comment.content)

    def to_dict(self):
        data = {
            'id': self.id,
            'author': self.author,
            'content': self.content,
            'post_id': self.post_id
        }
        return data

    def from_dict(self, data):
        for field in ['author', 'content', 'post_id']:
            if field in data:
                setattr(self, field, data[field])


@login.user_loader
def load_user(id):
    return User.query.get(int(id))
