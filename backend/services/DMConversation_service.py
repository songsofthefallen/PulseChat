from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import User
from repository.user_repository import UserRepository
from repository.DMConversation_repository import DMConversationRepository

class DMConversationService:

    @staticmethod
    def create_or_get_conversation(user_ids: list[int], current_user: User, db: Session):
        # 1. Make sure at least one other participant was supplied
        if not user_ids:
            raise HTTPException(
                status_code=400,
                detail="At least one participant is required"
            )

        # 2. Reject duplicate participant IDs
        if len(user_ids) != len(set(user_ids)):
            raise HTTPException(
                status_code=400,
                detail="Duplicate participants are not allowed"
            )

        # 3. Don't allow the requester to add themselves
        if current_user.id in user_ids:
            raise HTTPException(
                status_code=400,
                detail="You cannot add yourself as a participant"
            )

        # 4. Add the authenticated user
        participant_ids = user_ids + [current_user.id]

        # 5. Verify that every participant exists
        users = UserRepository.get_users_by_ids(participant_ids, db)

        if len(users) != len(participant_ids):
            raise HTTPException(
                status_code=404,
                detail="One or more participants do not exist"
            )

        # 6. Check whether this exact participant group already
        #    has a conversation
        conversation = DMConversationRepository.get_conversation_by_participants(
            participant_ids,
            db
        )

        if conversation:
            return conversation

        # 7. Create the conversation
        conversation = DMConversationRepository.create_conversation(db)

        # 8. Add all participants
        for user_id in participant_ids:
            DMConversationRepository.add_participant(
                conversation.id,
                user_id,
                db
            )

        # 9. Commit the entire operation
        try:
            db.commit()
            db.refresh(conversation)
        except Exception:
            db.rollback()
            raise

        return conversation

    @staticmethod
    def get_conversations(user_id: int, db: Session):
        return DMConversationRepository.get_conversations(user_id, db)

         
        

        


