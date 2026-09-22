from fastapi import WebSocket

class ConnectionManager:

    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}    
        self.rooms: dict[int, set[int]] = {}      

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

        for channel_id in list(self.rooms):
            self.rooms[channel_id].discard(user_id)

            if not self.rooms[channel_id]:
                del self.rooms[channel_id]

    def subscribe(self, user_id: int, channel_id: int):
        if channel_id not in self.rooms:
            self.rooms[channel_id] = set()

        self.rooms[channel_id].add(user_id)

    async def broadcast_to_room(self, channel_id: int, message: dict):
        if channel_id not in self.rooms:
            return

        for user_id in list(self.rooms[channel_id]):
            websocket = self.active_connections.get(user_id)

            if websocket:
                try:
                    await websocket.send_json(message)
                except Exception:
                    self.disconnect(user_id)

    async def send_to_user(self, user_id: int, message: dict):
        websocket = self.active_connections.get(user_id)

        if not websocket:
            return

        try:
            await websocket.send_json(message)
        except Exception:
            self.disconnect(user_id)

manager = ConnectionManager()