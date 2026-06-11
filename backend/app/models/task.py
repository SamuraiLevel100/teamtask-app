from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String)

    completed = Column(
        String,
        default="new"
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    owner = relationship(
        "User",
        back_populates="tasks"
    )

    board_id = Column(
    Integer,
    ForeignKey("boards.id")
    )

    board = relationship(
    "Board",
    back_populates="tasks"
    
)
