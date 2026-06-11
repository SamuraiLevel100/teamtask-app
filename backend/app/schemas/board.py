from pydantic import BaseModel


class BoardCreate(BaseModel):
    title: str


class BoardResponse(BaseModel):
    id: int
    title: str
    owner_id: int
    is_owner: bool = False
    is_member: bool = False

    class Config:
        from_attributes = True


class BoardsResponse(BaseModel):
    owned_boards: list[BoardResponse]
    invited_boards: list[BoardResponse]

    class Config:
        from_attributes = True