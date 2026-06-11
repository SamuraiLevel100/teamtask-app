from pydantic import BaseModel

from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: str = "new"
    board_id: int


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: str
    board_id: int

    class Config:
        from_attributes = True