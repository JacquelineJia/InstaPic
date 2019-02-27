from api import db
from api.models import User, Post, Comment

db.create_all()
db.session.commit()

# erase and clean the database
users = User.query.all()
for u in users:
    db.session.delete(u)

posts = Post.query.all()
for p in posts:
    db.session.delete(p)

comments = Comment.query.all()
for c in comments:
    db.session.delete(c)

db.session.commit()


# fill database with test data
user1 = User(username='jac')
user1.set_password('test')
db.session.add(user1)
db.session.commit()
users = User.query.all()
print(users)

post1 = Post()
db.session.add(post1)
db.session.commit()

