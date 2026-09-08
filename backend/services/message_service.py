from fastapi import HTTPException
from sqlalchemy.orm import Session
from repository.workspace_repository import WorkspaceRepository
from repository.channel_repository import ChannelRepository
from repository.channel_permission_repository import ChannelPermissionRepository
from repository.message_repository import MessageRepository


class MessageService:
    @ staticmethod
    def send_message(workspace_id: int, channel_id: int, user_id: int, content: str, db: Session):
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

        try:
            db.commit()
            db.refresh(db_message)
        except:
            db.rollback()
            raise

        return db_message
