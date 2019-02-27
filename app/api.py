from app import app, db
from app.forms import LoginForm, RegistrationForm
from app.models import User, Post, Comment
from flask import jsonify, render_template, request
from flask_cors import cross_origin
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse

def make_response(status_code, message=None):
    payload = {}
    if message:
        payload['message'] = message
    response = jsonify(payload)
    response.status_code = status_code
    return response

@app.route('/')
@app.route('/index')
def index():
    posts = [
        {'author': {'username': 'John'},
         'description': 'Beautiul day'
        }
    ]
    return render_template('index.html', title='Home', posts=posts)

@app.route('/api', methods=['GET'])
def info_view():
    output = {
        'info': 'GET /api',
        'login': 'POST /api/login',
        'logout': 'GET /api/logout',
        'create user': 'POST /api/users',
        'get user by username': 'GET /api/username/<username>',
        'create post': 'POST /api/users/<id>/posts',
        "get user's posts": 'GET /api/users/<id>/posts',
        'get all posts': 'GET /api/posts',
        'submit comment': 'POST /api/posts/<id>/comments',
        "view comments": 'GET /api/posts/<id>/comments'
    }
    return jsonify(output)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    if 'username' not in data or 'password' not in data:
        return make_response(400, 'must include username, password fields')
    user = User.query.filter_by(username=data['username']).first()
    if user is None or not user.check_password(data['password']):
        return make_response(204, 'Invalid username or password')
    response = jsonify(user.to_dict())
    response.status_code = 201
    return response

@app.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return make_response(201)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    if 'username' not in data or 'password' not in data:
        return make_response(400, 'must include username, password fields')
    if User.query.filter_by(username=data['username']).first():
        return make_response(400, 'please use a different username')
    user = User()
    user.from_dict(data)
    db.session.add(user)
    db.session.commit()
    response = jsonify(user.to_dict())
    response.status_code = 201
    return response

@app.route('/api/users', methods=['GET'])
def get_users():
    data = []
    users = User.query.all()
    for user in users:
        data.append(user.to_dict())
    return jsonify(data)

@app.route('/api/username/<username>', methods=['GET'])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    response = jsonify(user.to_dict())
    response.status_code = 200
    return response

@app.route('/api/posts', methods=['GET'])
def get_posts():
    data = []
    posts = Post.query.all()
    for post in posts:
        data.append(post.to_dict())
    response = jsonify(data)
    response.status_code = 200
    return response

@app.route('/api/users/<id>/posts', methods=['POST'])
def create_post(id):
    data = request.get_json() or {}
    if 'image' not in data:
        return make_response(400, 'must include image field')
    data['user_id'] = id
    post = Post()
    post.from_dict(data)
    db.session.add(post)
    db.session.commit()
    response = jsonify(post.to_dict())
    response.status_code = 201
    return response

@app.route('/api/users/<id>/posts', methods=['GET'])
def get_user_posts(id):
    data = []
    posts = Post.query.filter_by(user_id=id).all()
    for post in posts:
        data.append(post.to_dict())
    response = jsonify(data)
    response.status_code = 200
    return response

@app.route('/api/posts/<id>/comments', methods=['POST'])
def create_comment(id):
    data = request.get_json() or {}
    if 'author' not in data or 'content' not in data:
        return make_response(400, 'must include author and content fields')
    data['post_id'] = id
    comment = Comment()
    comment.from_dict(data)
    db.session.add(comment)
    db.session.commit()
    response = jsonify(comment.to_dict())
    response.status_code = 201
    return response

@app.route('/api/posts/<id>/comments', methods=['GET'])
def get_comments(id):
    data = []
    comments = Comment.query.filter_by(post_id=id).all()
    for comment in comments:
        data.append(comment.to_dict())
    response = jsonify(data)
    response.status_code = 200
    return response

app.run()