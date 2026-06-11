"""change board member role to text

Revision ID: f9843ac1d7b4
Revises: 3dda5ac4eedf
Create Date: 2026-06-09 16:15:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9843ac1d7b4'
down_revision: Union[str, Sequence[str], None] = '3dda5ac4eedf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'board_members',
        'role',
        existing_type=sa.String(length=50),
        type_=sa.Text(),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        'board_members',
        'role',
        existing_type=sa.Text(),
        type_=sa.String(length=50),
        existing_nullable=True,
    )
