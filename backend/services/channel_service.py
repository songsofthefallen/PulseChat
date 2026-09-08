from sqlalchemy.orm import Session
from fastapi import HTTPException
from services.workspace_service import WorkspaceRepository
from repository.channel_repository import ChannelRepository
from repository.channel_permission_repository import ChannelPermissionRepository

class ChannelService:

    @staticmethod
    def create_channel(workspace_id: int, name: str, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace Doesnt Exist")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of this workspace")

        if member.role not in ["owner", "admin"]:
            raise HTTPException(status_code=403, detail="Only the owner and admin can create a channel")
        
        channel_exist = ChannelRepository.is_channel_name_exist(workspace_id, name, db)

        if channel_exist:
            raise HTTPException(status_code=409, detail="Channel with this name already exist")

        channel = ChannelRepository.create_channel(workspace_id, name, db)

        ChannelPermissionRepository.create_channel_permission(channel.id, 'owner', db)

        ChannelPermissionRepository.create_channel_permission(channel.id, 'admin', db)

        ChannelPermissionRepository.create_channel_permission(channel.id, 'member', db)

        try:
            db.commit()
            db.refresh(channel)
        except:
            db.rollback()
            raise

        return channel

    @staticmethod
    def get_channels(workspace_id: int, user_id: int, db: Session):
        return ChannelRepository.get_list_of_channels(workspace_id, user_id, db)

    @staticmethod
    def update_channel(workspace_id: int, channel_id: int, name: str, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace Doesnt Exist")

        channel = ChannelRepository.channel_exist_in_workspace(workspace_id, channel_id, db)

        if channel is None:
            raise HTTPException(status_code=404, detail="Channel doesnt exist in this workspace")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of this workspace")

        if member.role not in ["owner", "admin"]:
            raise HTTPException(status_code=403, detail="Only the owner and admin can update the channel")

        channel_name = ChannelRepository.is_channel_name_exist_for_update(workspace_id, channel_id, name, db)

        if channel_name:
            raise HTTPException(status_code=409, detail="Channel with this name already exist")

        channel.name = name

        try:
            db.commit()
            db.refresh(channel)
        except:
            db.rollback()
            raise

        return channel

    @staticmethod
    def delete_channel(workspace_id: int, channel_id: int, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace Doesnt Exist")

        channel = ChannelRepository.channel_exist_in_workspace(workspace_id, channel_id, db)

        if channel is None:
            raise HTTPException(status_code=404, detail="Channel doesnt exist in this workspace")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=403, detail="User is not a member of this workspace")

        if member.role not in ["owner", "admin"]:
            raise HTTPException(status_code=403, detail="Only the owner and admin can update the channel")

        db.delete(channel)

        try:
            db.commit()
        except:
            db.rollback()
            raise

        return {"message": "Channel Successfully Deleted"}

    @staticmethod
    def get_viewable_channel(workspace_id: int, channel_id: int, user_id: int, db: Session):
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

        return channel


        



        

        

