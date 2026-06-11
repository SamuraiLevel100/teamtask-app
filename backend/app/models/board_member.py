from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    Text
)

from sqlalchemy.orm import relationship

from app.database import Base


class BoardMember(Base):
    __tablename__ = "board_members"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    board_id = Column(
        Integer,
        ForeignKey("boards.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    role = Column(
        Text,
        default="viewer"
    )

    board = relationship(
        "Board",
        back_populates="members"
    )

    user = relationship(
        "User",
        back_populates="board_memberships"
    )