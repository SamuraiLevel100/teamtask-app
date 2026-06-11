from pydantic import BaseModel


class MemberPermissions(BaseModel):
    can_view: bool = True
    can_create: bool = False
    can_update: bool = False
    can_delete: bool = False
    can_manage_members: bool = False


class BoardMemberCreate(BaseModel):
    username: str
    permissions: MemberPermissions = MemberPermissions()


class BoardMemberUpdate(BaseModel):
    permissions: MemberPermissions


class BoardMemberResponse(BaseModel):
    id: int
    user_id: int
    board_id: int
    role: str
    permissions: MemberPermissions

    class Config:
        from_attributes = True