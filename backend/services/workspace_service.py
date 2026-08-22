from sqlalchemy.orm import Session
from models import Message
from repository.workspace_repository import WorkspaceRepository
from fastapi import HTTPException
from schemas import SendMessageRequest

class WorkspaceService:

    @staticmethod
    def get_workspaces(user_id: int, db: Session):
        workspaces = WorkspaceRepository.get_list_of_workspace(user_id, db)

        return workspaces

    @staticmethod
    def get_one_workspace(workspace_id: int, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_one_workspace(workspace_id, user_id, db)
        if workspace is None:
            raise HTTPException(status_code=404, detail='Workspace Doesnt Exist')
        return workspace

    @staticmethod
    def get_channels(workspace_id: int, user_id: int, db: Session):
        channels = WorkspaceRepository.get_list_of_channels(workspace_id, user_id, db)
        if not channels:
            raise HTTPException(status_code=404, detail='No Channel Exist')
        return channels

    @staticmethod
    def get_one_channel(workspace_id: int, channel_id: int, user_id: int, db: Session):
        channel = WorkspaceRepository.get_one_channel(workspace_id, channel_id, user_id, db)
        if channel is None:
            raise HTTPException(status_code=404, detail='Channel Not Found')
        return channel

    @staticmethod
    def get_messages(workspace_id: int, channel_id: int, user_id: int, db: Session):
        messages = WorkspaceRepository.get_list_of_messages(workspace_id, channel_id, user_id, db)
        return messages

class MessageService:
    @ staticmethod
    def send_message(workspace_id: int, channel_id: int, user_id: int, message: SendMessageRequest, db: Session):
        channel = WorkspaceRepository.get_one_channel(workspace_id, channel_id, user_id, db)
        if channel is None:
            raise HTTPException(status_code=404, detail='Channel Not Found')

        db_message = Message(
            channel_id = channel_id,
            user_id = user_id,
            content=message.content
        )

        db.add(db_message)
        try:
            db.commit()
            db.refresh(db_message)
        except:
            db.rollback()
            raise

        return db_message