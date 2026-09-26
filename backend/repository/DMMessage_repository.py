from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from models import DMMessage

class DMMessageRepository:
    @staticmethod
    def create_direct_message(conversation_id:int, content: str, user_id: int, db: Session):
        message = DMMessage(conversation_id=conversation_id, user_id=user_id, content=content)

        db.add(message)
        db.flush()

        return message

    @staticmethod
    def get_direct_messages(conversation_id: int, mess_per_page: int, offset: int, db: Session):
        return db.query(DMMessage).options(joinedload(DMMessage.user)).filter(DMMessage.conversation_id == conversation_id).options(joinedload(DMMessage.user), joinedload(DMMessage.attachments)).order_by(DMMessage.created_at.desc()).offset(offset).limit(mess_per_page).all()
    
    @staticmethod
    def get_direct_message(conversation_id: int, message_id: int, db: Session):
        return db.query(DMMessage).filter(DMMessage.conversation_id == conversation_id, DMMessage.id == message_id).first()


    