import json

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.board_member import BoardMember

VALID_ROLES = ["owner", "admin", "editor", "viewer"]
ROLE_ALIASES = {
    "member": "viewer",
}

DEFAULT_PERMISSIONS = {
    "can_view": True,
    "can_create": False,
    "can_update": False,
    "can_delete": False,
    "can_manage_members": False,
}

ROLE_PERMISSIONS = {
    "viewer": {
        "can_view": True,
        "can_create": False,
        "can_update": False,
        "can_delete": False,
        "can_manage_members": False,
    },
    "editor": {
        "can_view": True,
        "can_create": True,
        "can_update": True,
        "can_delete": False,
        "can_manage_members": False,
    },
    "admin": {
        "can_view": True,
        "can_create": True,
        "can_update": True,
        "can_delete": True,
        "can_manage_members": True,
    },
}


def parse_permissions(role: str) -> dict:
    if not role:
        return DEFAULT_PERMISSIONS.copy()

    try:
        parsed = json.loads(role)
        if isinstance(parsed, dict):
            return {
                key: bool(parsed.get(key, default))
                for key, default in DEFAULT_PERMISSIONS.items()
            }
    except (ValueError, TypeError):
        pass

    normalized = role.lower()
    normalized = ROLE_ALIASES.get(normalized, normalized)

    return ROLE_PERMISSIONS.get(normalized, DEFAULT_PERMISSIONS.copy())


def permissions_to_label(permissions: dict) -> str:
    for label, perms in ROLE_PERMISSIONS.items():
        if perms == permissions:
            return label

    return "custom"


def get_user_role(
    db: Session,
    board_id: int,
    user_id: int
):
    board = db.query(Board).filter(
        Board.id == board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    if board.owner_id == user_id:
        return "owner"

    membership = db.query(
        BoardMember
    ).filter(
        BoardMember.board_id == board_id,
        BoardMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return permissions_to_label(parse_permissions(membership.role))


def require_permission(member, allowed_roles):
    if not member:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if permissions_to_label(parse_permissions(member.role)) not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )