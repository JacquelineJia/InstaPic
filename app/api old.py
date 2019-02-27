"""import sqlite3
from flask import Flask, request, jsonify
from flask_login import LoginManager
from werkzeug.security import check_password_hash, generate_password_hash
"""
from flask import render_template, flash, redirect
from app import app
from app.forms import LoginForm

login = LoginManager(app)

"""
returns items from db as dictionaries instead of lists
"""
def dict_factory(cursor, row):
    d = {}
    for i, col in enumerate(cursor.description):
        d[col[0]] = row[i]
    return d


"""
:param db_file: database db_file
:return: Connection object or None
"""
def create_connection(db_file):
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return None


"""
:param conn: Connection object
:param user: (username, password)
:return: user id
"""
def create_user(conn, user):
    sql = '''
        INSERT INTO users(username,password)
        VALUES(?,?); '''
    cur = conn.cursor()
    cur.execute(sql, user)
    return cur.lastrowid


"""
:param conn: Connection object
:param post: (user_id, image, description)
:return: post id
"""
def create_post(conn, post):
    sql = '''
        INSERT INTO posts(user_id,image,description)
        VALUES(?,?,?); '''
    cur = conn.cursor()
    cur.execute(sql, post)
    return cur.lastrowid


"""
:param conn: Connection object
:param comment: (post_id, name, content)
:return: comment id
"""
def create_comment(conn, comment):
    sql = '''
        INSERT INTO comments(post_id,name,content)
        VALUES(?,?,?); '''
    cur = conn.cursor()
    cur.execute(sql, comment)
    return cur.lastrowid


"""
:param conn: Connection object
:return: posts as dictionaries
"""
def select_all_posts(conn):
    conn.row_factory = dict_factory
    cur = conn.cursor()
    posts = cur.execute("SELECT * FROM posts;").fetchall()
    return posts


"""
:param conn: Connection object
:param user_id:
:return: posts as dictionaries
"""
def select_posts_by_user(conn, user_id):
    conn.row_factory = dict_factory
    cur = conn.cursor()
    posts = cur.execute("SELECT * FROM posts WHERE user_id=?;", (user_id)).fetchall()
    return posts


"""
:param conn: Connection object
:param post_id:
:return: comments as dictionaries
"""
def select_comments_by_post(conn, post_id):
    conn.row_factory = dict_factory
    cur = conn.cursor()
    comments = cur.execute("SELECT * FROM comments WHERE post_id=?;", (post_id)).fetchall()
    return comments


"""
:param conn: Connection object
:param username:
:return: integer or None
"""
def get_user_id(conn, username):
    conn.row_factory = dict_factory
    cur = conn.cursor()
    user = cur.execute("SELECT id FROM users WHERE username=?", (username)).fetchall()
    if not user
        return None
    return user[0][0]


@app.route('/', methods=['GET'])
def home():
    return "<h1>InstaPic</h1><p>hi</p>"


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The page could not be found.</p>", 404


@app.route('/api', methods=['GET'])
def info_view():
    output = {
        'info': 'GET /api',
        'register': 'POST /api/accounts',
        'login': 'POST /api/accounts/login',
        'logout': 'GET /api/accounts/logout',
        'all posts': 'GET /api/posts',
        'submit post': 'POST /api/accounts/<username>/posts',
        "user's posts": 'GET /api/accounts/<username>/posts',
        'submit comment': 'POST /api/posts/<id>/comments',
        "view comments": 'GET /api/posts/<id>/comments'
    }
    return jsonify(outout)


@app.route('/api/accounts', methods=['POST'])
def register():
    username = request.form['username']
    password_hash = generate_password_hash(request.form['password'])

    conn = create_connection('sqlite.db')
    with conn:
        user = (username, password_hash)
        create_user(conn, user)

    response = Response(
        status = 201
    )
    return response


@app.route('/api/accounts/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect('/index')
    return render_template('login.html', title='Sign In', form=form)


@app.route('/api/accounts/logout', methods=['GET'])
def logout():
    return jsonify()


@app.route('/api/posts', methods=['GET'])
def all_posts():
    conn = create_connection('sqlite.db')
    posts = select_all_posts(conn)
    return jsonify(posts)


@app.route('/api/accounts/<username>/posts', methods=['POST'])
def submit_post():
    user_id = get_user_id(username)
    if user_id is None:
        return page_not_found(404)

    image = request.form['image']
    description = request.form['description']

    conn = create_connection('sqlite.db')
    with conn:
        post = (user_id, image, description)
        create_post(conn, post)

    response = Response(
        status = 201
    )
    return response


@app.route('/api/accounts/<username>/posts', methods=['GET'])
def users_posts():
    user_id = get_user_id(username)
    if user_id is None:
        return page_not_found(404)

    conn = create_connection('sqlite.db')
    posts = select_posts_by_user(conn, user_id)
    return jsonify(posts)


@app.route('/api/posts/<id>/comments', methods=['POST'])
def submit_comment():
    name = request.form['name']
    content = request.form['content']

    conn = create_connection('sqlite.db')
    with conn:
        comment = (id, name, content)
        create_comment(conn, comment)

    response = Response(
        status = 201
    )
    return response


@app.route('/api/posts/<id>/comments', methods=['GET'])
def view_comments():
    conn = create_connection('sqlite.db')
    comments = select_comments_by_post(conn, id)
    return jsonify(comments)


@app.route('/api/resources/posts', methods=['GET'])
def api_id():
    if 'id' in request.args:
        id = int(request.args['id'])
    else:
        return "Error: No id field provided."

    results = []

    for picture in pictures:
        if picture['id'] == id:
            results.append(picture)

    return jsonify(results)


app.run()