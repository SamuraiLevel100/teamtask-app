import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5433/teamtask"
# DATABASE_URL = "postgresql+psycopg2://postgres:postgres@db:5432/teamtask"
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    # "postgresql+psycopg2://postgres:postgres@db:5432/teamtask"
    "postgresql+psycopg://postgres:postgres@localhost:5433/teamtask"
)
engine = create_engine(DATABASE_URL)

print("DATABASE URL:", DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()