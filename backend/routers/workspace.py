from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from models import User
from services.auth import UserService
from services.workspace_service import WorkspaceService
from database import get_db

router = APIRouter()

@router.get('/workspaces')
def get_my_workspaces(current_user: User = Depends (UserService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_user_workspaces(current_user, db)

@router.get('/workspaces/{workspace_id}/channels')
def workspace(workspace_id: int, current_user: User = Depends (UserService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_channels(workspace_id, current_user, db)