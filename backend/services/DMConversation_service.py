from fastapi import HTTPException
from sqlalchemy.orm import Session
from services.auth_service import AuthService

class DMConversationService:

    @staticmethod
    def create_or_get_conversation(user_ids: list[int], current_user_id: int, db: Session):

        participant_ids = list(set(user_ids))

        if not participant_ids:
            raise HTTPException(
                status_code=400,
                detail="At least one participant is required"
            )

        if current_user_id in participant_ids:
            raise HTTPException(
                status_code=400,
                detail="You cannot add yourself as a participant"
            )

        participant_ids.append(current_user_id)

        for user_id in user_ids:
            AuthService.find_user_by_id(user_id, db) #checks if the user exist if not throws an error

        

        


