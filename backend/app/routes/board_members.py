import json

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.board import Board
from app.models.user import User
from app.models.board_member import BoardMember

from app.schemas.board_member import (
    BoardMemberCreate,
    BoardMemberUpdate
)

from app.permissions import (
    parse_permissions,
    permissions_to_label,
)

from app.security import (
    get_current_user
)

router = APIRouter(
    prefix="/board-members",
    tags=["Board Members"]
)

@router.post("/{board_id}")
def add_member(
    board_id: int,
    data: BoardMemberCreate,
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

    member = db.query(BoardMember).filter(
        BoardMember.board_id == board_id,
        BoardMember.user_id == current_user.id
    ).first()

    if board.owner_id != current_user.id:
        if not member:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        current_permissions = parse_permissions(
            member.role
        )

        if not current_permissions[
            "can_manage_members"
        ]:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

    user = db.query(User).filter(
        User.username == data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing = db.query(
        BoardMember
    ).filter(
        BoardMember.board_id == board_id,
        BoardMember.user_id == user.id
    ).first()

    if user.id == board.owner_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot invite board owner"
        )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already added"
        )

    member = BoardMember(
        board_id=board_id,
        user_id=user.id,
        role=json.dumps(data.permissions.dict())
    )

    db.add(member)

    db.commit()

    return {
        "message": "Member added"
    }

@router.get("/{board_id}")
def get_members(
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

    current_member = db.query(BoardMember).filter(
        BoardMember.board_id == board_id,
        BoardMember.user_id == current_user.id
    ).first()

    if board.owner_id != current_user.id and not current_member:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    owner = db.query(User).filter(
        User.id == board.owner_id
    ).first()

    members = db.query(
        BoardMember,
        User.username
    ).join(
        User,
        User.id == BoardMember.user_id
    ).filter(
        BoardMember.board_id == board_id
    ).all()

    result = [
        {
            "id": 0,
            "username": owner.username,
            "role": "owner",
            "permissions": {
                "can_view": True,
                "can_create": True,
                "can_update": True,
                "can_delete": True,
                "can_manage_members": True,
            }
        }
    ]

    result.extend([
        {
            "id": member.id,
            "username": username,
            "role": permissions_to_label(parse_permissions(member.role)),
            "permissions": parse_permissions(member.role),
        }
        for member, username in members
    ])

    return result

@router.patch("/{member_id}")
def update_member(
    member_id: int,
    data: BoardMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    member = db.query(
        BoardMember
    ).filter(
        BoardMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    board = db.query(Board).filter(
        Board.id == member.board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    current_member = db.query(BoardMember).filter(
        BoardMember.board_id == board.id,
        BoardMember.user_id == current_user.id
    ).first()

    if member.user_id == current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Cannot modify your own membership"
        )

    if board.owner_id != current_user.id:
        if not current_member:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        current_permissions = parse_permissions(
            current_member.role
        )

        if not current_permissions[
            "can_manage_members"
        ]:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

    member.role = json.dumps(data.permissions.dict())
    db.commit()

    return {
        "message": "Member updated"
    }

@router.delete("/{member_id}")
def remove_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    member = db.query(
        BoardMember
    ).filter(
        BoardMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    board = db.query(Board).filter(
        Board.id == member.board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    current_member = db.query(BoardMember).filter(
        BoardMember.board_id == board.id,
        BoardMember.user_id == current_user.id
    ).first()

    if member.user_id == current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Cannot remove yourself from this board"
        )

    if board.owner_id != current_user.id:
        if not current_member:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        current_permissions = parse_permissions(
            current_member.role
        )

        if not current_permissions[
            "can_manage_members"
        ]:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

    db.delete(member)

    db.commit()

    return {
        "message": "Member removed"
    }