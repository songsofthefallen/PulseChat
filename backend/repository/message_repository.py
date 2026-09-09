from models import Message
from sqlalchemy.orm import Session, joinedload

class MessageRepository:
    @staticmethod
    def create_message(channel_id: int, user_id: int, content: str, db: Session):
        message = Message(channel_id=channel_id, user_id=user_id, content=content)

        db.add(message)
        db.flush()

        return message

    @staticmethod
    def get_messages(channel_id: int,limit: int,offset: int,db: Session):
        return db.query(Message).options(
            joinedload(Message.user)).filter(
                Message.channel_id == channel_id).order_by(
                    Message.created_at.asc()).offset(offset).limit(limit).all()
    @staticmethod
    def get_channel_message(channel_id: int, message_id, db):
        return db.query(Message).filter(Message.channel_id == channel_id, Message.id == message_id).first()