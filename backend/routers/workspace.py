from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from models import User
from services.auth_service import AuthService
from services.workspace_service import WorkspaceService, MessageService
from database import get_db
from schemas import WorkspaceResponse, MessageResponse, SendMessageRequest

router = APIRouter()

@router.get('/workspaces')
def get_my_workspaces(current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_workspaces(current_user.id, db)

@router.get('/workspaces/{workspace_id}', response_model=WorkspaceResponse)
def get_workspace(workspace_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_one_workspace(workspace_id, current_user.id, db)

@router.get('/workspaces/{workspace_id}/channels')
def get_my_channels(workspace_id: int, current_user: User = Depends (AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_channels(workspace_id, current_user.id, db)

@router.get('/workspaces/{workspace_id}/channels/{channel_id}')
def get_channel(workspace_id: int, channel_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_one_channel(workspace_id, channel_id, current_user.id, db)

@router.get('/workspaces/{workspace_id}/channels/{channel_id}/messages', response_model=list[MessageResponse])
def get_my_messages(workspace_id: int, channel_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_messages(workspace_id, channel_id, current_user.id, db)

@router.post("/workspaces/{workspace_id}/channels/{channel_id}/messages",response_model=MessageResponse)
def send_message( workspace_id: int, channel_id: int, message: SendMessageRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.send_message( workspace_id, channel_id, current_user.id, message, db)



