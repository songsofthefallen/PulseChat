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
            .options(joinedload(DMConversation.participants))
            .first()
        )