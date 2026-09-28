from fastapi import WebSocket
from sqlalchemy.orm import Session
from websocket.connection_manager import manager
from repository.message_repository import MessageRepository

async def handle_channel_event(data: dict, user, websocket: WebSocket, db: Session):
    if data["type"] == "subscribe":
        manager.subscribe(user.id, data["channel_id"])
        return True

    if data["type"] == "typing":
        await manager.broadcast_to_room(
            data["channel_id"],
            {
                "type": "user_typing",
                "channel_id": data["channel_id"],
                "user_id": user.id,
                "username": user.username
            }
        )
        return True

    if data["type"] == "message_delivered":
        db.rollback()

        message = MessageRepository.get_channel_message(
            data["channel_id"],
            data["message_id"],
            db
        )

        await manager.send_to_user(
            message.user_id,
            {
                "type": "message_delivered",
                "message_id": data["message_id"],
                "channel_id": data["channel_id"],
                "user_id": user.id
            }
        )
        return True

    return False