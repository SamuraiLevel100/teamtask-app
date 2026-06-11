from app.database import SessionLocal
from app.models.user import User
from app.models.board import Board
from app.models.board_member import BoardMember

session = SessionLocal()
user = session.query(User).filter(User.username == 'Bob').first()
print('user', user.id, user.username)
owned_boards = session.query(Board).filter(Board.owner_id == user.id).all()
member_boards = session.query(Board).join(BoardMember, Board.id == BoardMember.board_id).filter(BoardMember.user_id == user.id).distinct().all()
print('owned:', [(b.id, b.title, b.owner_id) for b in owned_boards])
print('member:', [(b.id, b.title, b.owner_id) for b in member_boards])
print('combined:', [{
    'id': b.id,
    'title': b.title,
    'owner_id': b.owner_id,
    'is_owner': b.owner_id == user.id,
    'is_member': b.owner_id != user.id,
} for b in (owned_boards + member_boards)])
