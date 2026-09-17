from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from websocket.connection_manager import ConnectionManager
from sqlalchemy.orm import Session
from database import get_db
from services.auth_service import AuthService
import json

router = APIRouter()

manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):

    access_token = websocket.cookies.get("access_token")


    if access_token is None:
        await websocket.close(code=1008)
        return

    user = AuthService.get_user_from_token(access_token, db)

    await manager.connect(user.id, websocket)

    try:
        while True:
            data = json.loads(await websocket.receive_text())
            print(data)

            if data["type"] == "subscribe":
                channel_id = data["channel_id"]

                manager.subscribe(
                    user.id,
                    channel_id
                )
                print(manager.rooms)
    except WebSocketDisconnect:
        manager.disconnect(user.id)