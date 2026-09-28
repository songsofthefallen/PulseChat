from sqlalchemy.orm import Session
from websocket.connection_manager import manager
from repository.DMConversation_repository import DMConversationRepository



async def handle_dm_event(data: dict, user, db: Session):
    if data["type"] != "subscribe_dm":
        return False

    conversation_id = data["conversation_id"]

    participant = DMConversationRepository.get_conversation_member(
        conversation_id,
        user.id,
        db
    )

    if not participant:
        return True

    manager.subscribe_dm(user.id, conversation_id)

    return True