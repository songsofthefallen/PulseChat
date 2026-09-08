from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import User
from services.auth_service import AuthService
from services.dashboard_service import DashboardService
from services.workspace_service import WorkspaceService
from services.channel_service import ChannelService
from database import get_db
from schemas import WorkspaceResponse, MessageResponse, SendMessageRequest, RecentConversationResponse

router = APIRouter()

@router.get("/dashboard/workspaces")
def get_my_workspaces(current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_user_workspaces(current_user.id, db)

@router.get("/dashboard/workspaces/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(workspace_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DashboardService.get_one_workspace(workspace_id, current_user.id, db)

@router.get("/dashboard/workspaces/{workspace_id}/channels")
def get_my_channels(workspace_id: int, current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return ChannelService.get_channels(workspace_id, current_user.id, db)

@router.get("/dashboard/workspaces/{workspace_id}/channels/{channel_id}")
def get_channel(workspace_id: int, channel_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DashboardService.get_one_channel(workspace_id, channel_id, current_user.id, db)

@router.get("/workspaces/{workspace_id}/channels/{channel_id}/messages", response_model=list[MessageResponse])
def get_my_messages(workspace_id: int, channel_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DashboardService.get_messages(workspace_id, channel_id, current_user.id, db)


@router.get("/dashboard/recent-conversations", response_model=list[RecentConversationResponse])
def get_recent_conversations(current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DashboardService.get_recent_conversations(current_user.id, db)

@router.get("/dashboard/pinned-channels")
def get_pinned_channels(current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DashboardService.get_pinned_channels(current_user.id, db)

@router.post("/channels/{channel_id}/pin")
def pin_channel(channel_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    DashboardService.get_channel_for_user(channel_id, current_user.id, db) 

    DashboardService.pin_channel(current_user.id, channel_id, db)

    return {"message": "Channel pinned"}

@router.delete("/channels/{channel_id}/pin")
def unpin_channel(channel_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):
    DashboardService.unpin_channel(current_user.id, channel_id, db)

    return {"message": "Channel unpinned"}