from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from repository.workspace_repository import WorkspaceRepository
from repository.channel_repository import ChannelRepository
from repository.channel_permission_repository import ChannelPermissionRepository
from repository.message_repository import MessageRepository
from config import settings
import os
import uuid


class MessageService:
    @ staticmethod
    def send_message(workspace_id: int, channel_id: int, content: str, file: UploadFile | None, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace Doesnt Exist")

        channel = ChannelRepository.channel_exist_in_workspace(workspace_id, channel_id, db)

        if channel is None:
            raise HTTPException(status_code=404, detail="Channel doesnt exist in this workspace")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of this workspace")

        send = ChannelPermissionRepository.get_channel_permission(channel_id, member.role, db)

        if send is None or not send.can_send:
            raise HTTPException(status_code=403, detail="User cannot send messages in this channel")

        db_message = MessageRepository.create_message(channel_id, user_id, content, db)
        

        if file:

            file_content = file.file.read()
            file_size = len(file_content)

            if file_size > settings.MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail="File size cannot exceed 10 MB"
                )

            if file.content_type not in settings.ALLOWED_FILE_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail="File type is not allowed"
                )

            upload_dir = "uploads"
            os.makedirs(upload_dir, exist_ok=True)

            unique_name = str(uuid.uuid4())

            extension = os.path.splitext(file.filename)[1]
            stored_name = f"{unique_name}{extension}"

            file_details = os.path.join(upload_dir, stored_name)

            with open(file_details, "wb") as buffer:
                buffer.write(file_content)

            file_name = file.filename
            file_type = file.content_type
            file_url = file_details

            MessageRepository.create_attachment(
                message_id=db_message.id,
                file_name=file_name,
                file_url=file_url,
                file_type=file_type,
                file_size=file_size,
                db=db
            )

        try:
            db.commit()
            db.refresh(db_message)
        except Exception:
            db.rollback()

            if file and os.path.exists(file_details):
                os.remove(file_details)

            raise

        return db_message

    @staticmethod
    def get_messages(workspace_id: int, channel_id: int, page: int, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace Doesnt Exist")

        channel = ChannelRepository.channel_exist_in_workspace(workspace_id, channel_id, db)

        if channel is None:
            raise HTTPException(status_code=404, detail="Channel doesnt exist in this workspace")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of this workspace")

        view = ChannelPermissionRepository.get_channel_permission(channel_id, member.role, db)

        if view is None or not view.can_view:
            raise HTTPException(status_code=403, detail="User cannot view this channel")

        if page < 1:
            raise HTTPException(status_code=400, detail="Page must be greater than 0")

        mess_per_page = settings.MESSAGES_PER_PAGE
        offset = (page - 1) * mess_per_page

        messages = MessageRepository.get_messages(channel_id, mess_per_page, offset, db)

        return messages

    @staticmethod
    def edit_message(workspace_id: int, channel_id: int, message_id: int, content: str, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace Doesnt Exist")

        channel = ChannelRepository.channel_exist_in_workspace(workspace_id, channel_id, db)

        if channel is None:
            raise HTTPException(status_code=404, detail="Channel doesnt exist in this workspace")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of this workspace")

        channel_message = MessageRepository.get_channel_message(channel_id, message_id, db)

        if channel_message is None:
            raise HTTPException(status_code=404, detail="Message Not Found")

        if channel_message.user_id != user_id:
            raise HTTPException(status_code=403, detail="You cannot edit this message")

        channel_message.content = content

        try:
            db.commit()
            db.refresh(channel_message)
        except:
            db.rollback()
            raise

        return channel_message

    @staticmethod
    def delete_message(workspace_id: int, channel_id: int, message_id: int, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace Doesnt Exist")

        channel = ChannelRepository.channel_exist_in_workspace(workspace_id, channel_id, db)

        if channel is None:
            raise HTTPException(status_code=404, detail="Channel doesnt exist in this workspace")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of this workspace")

        channel_message = MessageRepository.get_channel_message(channel_id, message_id, db)

        if channel_message is None:
            raise HTTPException(status_code=404, detail="Message Not Found")

        if channel_message.user_id != user_id:
            raise HTTPException(status_code=403, detail="You cannot delete this message")

        db.delete(channel_message)

        try:
            db.commit()
        except:
            db.rollback()
            raise

        return {"message": "Message Successfully Deleted"}

