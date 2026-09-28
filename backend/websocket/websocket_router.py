from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from websocket.connection_manager import manager
from sqlalchemy.orm import Session
from database import get_db
from services.auth_service import AuthService
import json
import redis
from dependencies import Dependencies
from services.presence_service import PresenceService
from websocket.channel_handler import handle_channel_event
from websocket.dm_handler import handle_dm_event

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

            handled = await handle_channel_event(
                data,
                user,
                websocket,
                db
            )

            if not handled:
                await handle_dm_event(data, user, db)

            print("WS RECEIVED FROM CLIENT:", data)

    except WebSocketDisconnect:
        was_active = manager.disconnect(user.id, websocket)

        if was_active:
            await manager.broadcast_to_all({
                "type": "user_offline",
                "user_id": user.id,
                "username": user.username
            })