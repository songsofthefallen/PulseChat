from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from websocket.connection_manager import manager
from sqlalchemy.orm import Session
from database import get_db
from services.auth_service import AuthService
import json
from repository.message_repository import MessageRepository
from models import Message
import redis
from dependencies import Dependencies
from services.presence_service import PresenceService

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db), redis_client: redis.Redis = Depends(Dependencies.get_redis)):

    access_token = websocket.cookies.get("access_token")


    if access_token is None:
        await websocket.close(code=1008)
        return

    user = AuthService.get_user_from_token(access_token, db)

    await manager.connect(user.id, websocket)

    PresenceService.set_online(user.id, redis_client)

    await manager.broadcast_to_all({
        "type": "user_online",
        "user_id": user.id,
        "username": user.username
    })

    try:
        while True:
            data = json.loads(await websocket.receive_text())
            print("WS RECEIVED FROM CLIENT:", data)

            if data["type"] == "subscribe":
                channel_id = data["channel_id"]

                manager.subscribe(
                    user.id,
                    channel_id
                )

            elif data["type"] == "typing":
                channel_id = data["channel_id"]

                await manager.broadcast_to_room(
                    channel_id,
                    {
                        "type": "user_typing",
                        "channel_id": channel_id,
                        "user_id": user.id,
                        "username": user.username
                    }
                )

            elif data["type"] == "message_delivered":

                db.rollback()

                message = MessageRepository.get_channel_message(
                    data["channel_id"],
                    data["message_id"],
                    db
                )

                message_test = db.query(Message).filter(
                    Message.id == data["message_id"]
                ).first()

                await manager.send_to_user(
                    message.user_id,
                    {
                        "type": "message_delivered",
                        "message_id": data["message_id"],
                        "channel_id": data["channel_id"],
                        "user_id": user.id
                    }
                )

    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)

        await manager.broadcast_to_all({
            "type": "user_offline",
            "user_id": user.id,
            "username": user.username
        })