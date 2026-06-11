from sqlalchemy import Column, Integer, String, ForeignKey

from sqlalchemy.orm import relationship

from app.database import Base


class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    owner = relationship(
        "User",
        back_populates="boards"
    )

    tasks = relationship(
        "Task",
        back_populates="board",
        cascade="all, delete"
    )

    members = relationship(
        "BoardMember",
        back_populates="board",
        cascade="all, delete"
    )