from fastapi import HTTPException
from models import DMParticipant
from sqlalchemy.orm import Session

class DMParticipantRepository:

    @staticmethod
    def add_participant(conversation_id: int, user_id: int, db: Session):
        participant = DMParticipant(conversation_id=conversation_id, user_id=user_id)

        db.add(participant)
        db.flush()

        return participant