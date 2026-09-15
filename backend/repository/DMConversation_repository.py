from fastapi import HTTPException
from models import DMConversation, DMParticipant
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

class DMConversationRepository:

    @staticmethod
    def create_conversation(db: Session):
        conversation = DMConversation()

        db.add(conversation)
        db.flush()

        return conversation

    @staticmethod
    def add_participant(conversation_id: int, user_id: int, db: Session):
        participant = DMParticipant(conversation_id=conversation_id, user_id=user_id)

        db.add(participant)
        db.flush()

        return participant

    @staticmethod
    def get_conversation_by_participants(
        user_ids: list[int],
        db: Session
    ):
        participant_count = (
            db.query(func.count(DMParticipant.user_id))
            .filter(
                DMParticipant.conversation_id == DMConversation.id
            )
            .correlate(DMConversation)
            .scalar_subquery()
        )

        return (
            db.query(DMConversation)
            .join(DMConversation.participants)
            .filter(DMParticipant.user_id.in_(user_ids))
            .group_by(DMConversation.id)
            .having(func.count(DMParticipant.user_id) == len(user_ids))
            .having(participant_count == len(user_ids))
            .options(joinedload(DMConversation.participants).joinedload(DMParticipant.user))
            .first()
        )

    @staticmethod
    def get_conversation(conversation_id: int, db: Session):
        return db.query(DMConversation).filter(DMConversation.id == conversation_id).first()


    @staticmethod
    def get_conversation_member(conversation_id: int, user_id: int, db: Session):
        return db.query(DMParticipant).filter(DMParticipant.conversation_id == conversation_id, DMParticipant.user_id == user_id).first()

    @staticmethod
    def get_conversations(user_id: int, db: Session):
        return db.query(DMConversation).join(DMConversation.participants).filter(DMParticipant.user_id == user_id).options(joinedload(DMConversation.participants).joinedload(DMParticipant.user)).order_by(DMConversation.created_at.desc()).all()
    