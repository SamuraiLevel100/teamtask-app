from fastapi import (
    HTTPException,
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.task import Task
from app.models.user import User
from app.models.board import Board
from app.models.board_member import BoardMember

from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskUpdate
)

from app.permissions import parse_permissions
from app.security import get_current_user


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_board_permissions(db: Session, board_id: int, user_id: int):
    board = db.query(Board).filter(
        Board.id == board_id
    ).first()

    if not board:
        return None

    if board.owner_id == user_id:
        return {
            "can_view": True,
            "can_create": True,
            "can_update": True,
            "can_delete": True,
            "can_manage_members": True,
        }

    member = db.query(BoardMember).filter(
        BoardMember.board_id == board_id,
        BoardMember.user_id == user_id
    ).first()

    if not member:
        return None

    return parse_permissions(member.role)


@router.post(
    "/",
    response_model=TaskResponse
)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    board = db.query(Board).filter(
        Board.id == task.board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    permissions = get_board_permissions(
        db,
        board.id,
        current_user.id
    )

    if not permissions or not permissions["can_create"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    new_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        owner_id=current_user.id,
        board_id=task.board_id
    )

    db.add(new_task)

    db.commit()

    db.refresh(new_task)

    return new_task


@router.get(
    "/board/{board_id}",
    response_model=list[TaskResponse]
)
def get_tasks(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    board = db.query(Board).filter(
        Board.id == board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    permissions = get_board_permissions(
        db,
        board.id,
        current_user.id
    )

    if not permissions or not permissions["can_view"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    tasks = db.query(Task).filter(
        Task.board_id == board_id
    ).all()

    return tasks


@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    permissions = get_board_permissions(
        db,
        task.board_id,
        current_user.id
    )

    if not permissions or not permissions["can_view"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return task


@router.put(
    "/{task_id}",
    response_model=TaskResponse
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    permissions = get_board_permissions(
        db,
        task.board_id,
        current_user.id
    )

    if not permissions or not permissions["can_update"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if task_data.title is not None:
        task.title = task_data.title

    if task_data.description is not None:
        task.description = task_data.description

    if task_data.completed is not None:
        task.completed = task_data.completed

    db.commit()

    db.refresh(task)

    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    permissions = get_board_permissions(
        db,
        task.board_id,
        current_user.id
    )

    if not permissions or not permissions["can_delete"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    db.delete(task)

    db.commit()

    return {
        "message": "Task deleted"
    }