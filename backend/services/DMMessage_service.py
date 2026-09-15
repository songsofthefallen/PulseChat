from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from models import User
from repository.DMMessage_repository import DMMessageRepository
from repository.DMConversation_repository import DMConversationRepository
from repository.message_repository import MessageRepository
from config import settings
import uuid
import os


class DMMessageService:

    @staticmethod
    def create_direct_message(conversation_id: int, content: str, file: UploadFile | None, user_id: int, db: Session):
        conversation = DMConversationRepository.get_conversation(conversation_id, db)

        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")

        member = DMConversationRepository.get_conversation_member(conversation_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of conversation")

        file_details = None

        try:
            file_size = None
            file_name = None
            file_type = None

            if file:
                if not file.filename:
                    raise HTTPException(status_code=400, detail="File name is required")

                if not file.content_type:
                    raise HTTPException(status_code=400, detail="File type is required")

                file_content = file.file.read()
                file_size = len(file_content)

                if file_size > settings.MAX_FILE_SIZE:
                    raise HTTPException(status_code=400, detail="File size cannot exceed 10 MB")

                if file.content_type not in settings.ALLOWED_FILE_TYPES:
                    raise HTTPException(status_code=400, detail="File type is not allowed")

                upload_dir = "uploads"
                os.makedirs(upload_dir, exist_ok=True)

                unique_name = str(uuid.uuid4())
                extension = os.path.splitext(file.filename)[1]
                stored_name = f"{unique_name}{extension}"

                file_details = os.path.join(
                    upload_dir,
                    stored_name
                )

                with open(file_details, "wb") as buffer:
                    buffer.write(file_content)

                file_name = file.filename
                file_type = file.content_type

            message = DMMessageRepository.create_direct_message(conversation_id, content, user_id, db)

            if file:
                MessageRepository.create_attachment(
                    dm_message_id=message.id,
                    file_name=file_name,
                    file_url=file_details,
                    file_type=file_type,
                    file_size=file_size,
                    db=db
                )

            db.commit()
            db.refresh(message)

        except Exception:
            db.rollback()

            if file_details and os.path.exists(file_details):
                os.remove(file_details)

            raise

        return message

    @staticmethod
    def get_direct_messages(conversation_id: int, page: int, user_id: int, db: Session):
        conversation = DMConversationRepository.get_conversation(conversation_id, db)

        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")

        member = DMConversationRepository.get_conversation_member(conversation_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of conversation")

        if page < 1:
            raise HTTPException(status_code=400, detail="Page must be greater than 0")

        mess_per_page = settings.MESSAGES_PER_PAGE
        offset = (page - 1) * mess_per_page

        messages = DMMessageRepository.get_direct_messages(conversation_id, mess_per_page, offset, db)

        return messages

    @staticmethod
    def edit_direct_message(conversation_id: int, message_id: int, content: str, user_id: int, db: Session):
        conversation = DMConversationRepository.get_conversation(conversation_id, db)

        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")

        message = DMMessageRepository.get_direct_message(conversation_id, message_id, db)

        if message is None:
            raise HTTPException(status_code=404, detail="Message not found")

        member = DMConversationRepository.get_conversation_member(conversation_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of conversation")

        if message.user_id != user_id:
                raise HTTPException(status_code=403, detail="You can only edit your own messages")

        message.content = content

        try:
            db.commit()
            db.refresh(message)
        except Exception:
            db.rollback()
            raise

        return message

    @staticmethod
    def delete_direct_message(conversation_id: int, message_id: int, user_id: int, db: Session):
        conversation = DMConversationRepository.get_conversation(conversation_id, db)

        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")

        message = DMMessageRepository.get_direct_message(conversation_id, message_id, db)

        if message is None:
            raise HTTPException(status_code=404, detail="Message not found")

        member = DMConversationRepository.get_conversation_member(conversation_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of conversation")

        if message.user_id != user_id:
            raise HTTPException(status_code=403, detail="You can only delete your own messages")
        
        for attachment in message.attachments:
            if os.path.exists(attachment.file_url):
                os.remove(attachment.file_url)

        db.delete(message)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        return {"message": "Message Successfully Deleted"}


        
        
