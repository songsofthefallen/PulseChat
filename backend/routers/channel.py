from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from schemas import CreateChannelRequest, UpdateChannelRequest, UpdateChannelPermissionRequest
from services.channel_service import ChannelService

router = APIRouter()

@router.post("/workspaces/{workspace_id}/channels")
def create_channel(workspace_id: int, data: CreateChannelRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return ChannelService.create_channel(workspace_id, data.name, current_user.id, db)

@router.get("/workspaces/{workspace_id}/channels")
def get_my_channels(workspace_id: int, current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return ChannelService.get_channels(workspace_id, current_user.id, db)

@router.patch("/workspaces/{workspace_id}/channels/{channel_id}")
def update_channel(workspace_id: int, channel_id: int, data: UpdateChannelRequest, current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return ChannelService.update_channel(workspace_id, channel_id, data.name, current_user.id, db)

@router.delete("/workspaces/{workspace_id}/channels/{channel_id}")
def delete_channel(workspace_id: int, channel_id: int, current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return ChannelService.delete_channel(workspace_id, channel_id, current_user.id, db)

@router.get("/workspaces/{workspace_id}/channels/{channel_id}")
def get_channel(workspace_id: int, channel_id: int, current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return ChannelService.get_viewable_channel(workspace_id, channel_id, current_user.id, db)

@router.patch("/workspaces/{workspace_id}/channels/{channel_id}/permissions/{role}")
def update_channel_permission(workspace_id: int, channel_id: int, role: str, data: UpdateChannelPermissionRequest, current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return ChannelService.update_channel_permission(workspace_id, channel_id, role, data, current_user.id, db)