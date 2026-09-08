from models import Message
from sqlalchemy.orm import Session

class MessageRepository:
    @staticmethod
    def create_message(channel_id: int, user_id: int, content: str, db: Session):
        message = Message(channel_id=channel_id, user_id=user_id, content=content)

        db.add(message)
        db.flush()

        return message