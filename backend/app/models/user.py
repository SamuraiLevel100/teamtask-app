from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base
from sqlalchemy.orm import relationship



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, index=True)

    email = Column(String, unique=True, index=True)

    hashed_password = Column(String)

    is_admin = Column(Boolean, default=False)

    tasks = relationship(
        "Task",
        back_populates="owner"
    )

    boards = relationship(
        "Board",
        back_populates="owner"
    )

    board_memberships = relationship(
        "BoardMember",
        back_populates="user"
    )
    
