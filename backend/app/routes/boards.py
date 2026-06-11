from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.board import Board

from app.models.user import User

from app.models.board_member import BoardMember

from app.schemas.board import (
    BoardCreate,
    BoardResponse,
    BoardsResponse,
)

from app.security import (
    get_current_user,
)

router = APIRouter(
    prefix="/boards",
    tags=["Boards"]
)


@router.post(
    "/",
    response_model=BoardResponse
)
def create_board(
    board: BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    new_board = Board(
        title=board.title,
        owner_id=current_user.id
    )

    db.add(new_board)

    db.commit()

    db.refresh(new_board)

    return new_board


@router.get(
    "/",
    response_model=BoardsResponse
)
def get_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    owned_boards = db.query(Board).filter(
        Board.owner_id == current_user.id
    ).all()

    invited_boards = (
        db.query(Board)
        .join(
            BoardMember,
            Board.id == BoardMember.board_id
        )
        .filter(
            BoardMember.user_id == current_user.id,
            Board.owner_id != current_user.id
        )
        .distinct()
        .all()
    )

    owned_list = [
        {
            "id": board.id,
            "title": board.title,
            "owner_id": board.owner_id,
            "is_owner": True,
            "is_member": False,
        }
        for board in owned_boards
    ]

    owned_board_ids = {board.id for board in owned_boards}

    invited_list = [
        {
            "id": board.id,
            "title": board.title,
            "owner_id": board.owner_id,
            "is_owner": False,
            "is_member": True,
        }
        for board in invited_boards
        if board.id not in owned_board_ids
    ]

    return {
        "owned_boards": owned_list,
        "invited_boards": invited_list,
    }

@router.delete("/{board_id}")
def delete_board(
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

    if board.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    db.delete(board)

    db.commit()

    return {
        "message":
            "Board deleted successfully"
    }