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

    def subscribe(self, user_id: int, channel_id: int):
        if channel_id not in self.rooms:
            self.rooms[channel_id] = set()

        self.rooms[channel_id].add(user_id)