from models import Message, MessageAttachment, MessageRead
from sqlalchemy.orm import Session, joinedload

class MessageRepository:
    @staticmethod
    def create_message(channel_id: int, user_id: int, content: str, db: Session):
        message = Message(channel_id=channel_id, user_id=user_id, content=content)

        db.add(message)
        db.flush()

        return message

    @staticmethod
    def get_messages(channel_id: int,limit: int,before_id: int | None,db: Session):
        query = db.query(Message).options(joinedload(Message.user)).filter(Message.channel_id == channel_id)

        if before_id is not None:
            query = query.filter(Message.id < before_id)

        return query.order_by(Message.id.desc()).limit(limit).all()
    @staticmethod
    def get_channel_message(channel_id: int, message_id, db):
        return db.query(Message).filter(Message.channel_id == channel_id, Message.id == message_id).first()

    @staticmethod
    def create_attachment(file_name: str,file_url: str,file_type: str,file_size: int,db: Session, message_id: int | None = None, dm_message_id: int | None = None):

        attachment = MessageAttachment(message_id=message_id,dm_message_id=dm_message_id,file_name=file_name,file_url=file_url,file_type=file_type,file_size=file_size)

        db.add(attachment)
        db.flush()

        return attachment

    @staticmethod
    def mark_message_as_read(message_id: int, user_id: int, db: Session):
        existing = db.query(MessageRead).filter(MessageRead.message_id == message_id,MessageRead.user_id == user_id).first()

        if existing:
            return existing

        message_read = MessageRead(message_id=message_id, user_id=user_id)

        db.add(message_read)
        db.flush()

        return message_read

    @staticmethod
    def get_read_messages(channel_id: int, db: Session):
        return db.query(MessageRead).options(joinedload(MessageRead.user)).join(Message, Message.id == MessageRead.message_id).filter(Message.channel_id == channel_id).all()