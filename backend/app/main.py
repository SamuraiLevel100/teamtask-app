from fastapi import FastAPI
from app.database import engine
from app.models.user import User
from app.models.task import Task
from fastapi.middleware.cors import CORSMiddleware
from app.routes import users, auth, tasks
from app.models.board import Board
from app.routes.boards import router as boards_router
from app.routes.board_members import router as board_members_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(boards_router)
app.include_router(board_members_router)


@app.get("/")
def root():
    return {"message": "TeamTask API works"}