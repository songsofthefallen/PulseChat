from fastapi import FastAPI
from routers import auth, user, dashboard, workspace, channel, message, dm_conversation, dm_message
from fastapi.middleware.cors import CORSMiddleware
from websocket import websocket_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(user.router)
app.include_router(workspace.router)
app.include_router(channel.router)
app.include_router(message.router)
app.include_router(dm_conversation.router)
app.include_router(dm_message.router)
app.include_router(websocket_router.router)
