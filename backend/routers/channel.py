from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from schemas import CreateChannelRequest, UpdateChannelRequest
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