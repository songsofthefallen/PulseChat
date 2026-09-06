from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import CreateWorkspaceRequest, UpdateWorkspaceRequest, AddWorkspaceMemberRequest, WorkspaceMemberResponse, UpdateWorkspaceMemberRoleRequest
from database import get_db
from models import User
from services.auth_service import AuthService
from services.workspace_service import WorkspaceService

router = APIRouter()

@router.post("/workspaces")
def create_workspace(data: CreateWorkspaceRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.create_workspace(data.name, current_user.id, db)

@router.get("/workspaces")
def get_user_workspaces(current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_user_workspaces(current_user.id, db)

@router.patch("workspaces/{workspace_id}")
def update_workspace(workspace_id: int, data: UpdateWorkspaceRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.update_workspace(workspace_id, current_user.id, data.name, db)

@router.delete("/workspaces/{workspace_id}")
def update_workspace(workspace_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.delete_workspace(workspace_id, current_user.id,  db)

@router.post("/workspaces/{workspace_id}/members")
def add_member_to_workspace(workspace_id: int, added_user_id: AddWorkspaceMemberRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.add_member_to_workspace(workspace_id, added_user_id.user_id, current_user.id, db)

@router.get("/workspace/{workspace_id}/members", response_model=list[WorkspaceMemberResponse])
def get_workspace_members(workspace_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.get_workspace_members(workspace_id, current_user.id, db)

@router.delete("/workspace/{workspace_id}/members/{user_id}")
def delete_workspace_member(workspace_id: int, user_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.delete_workspace_member(workspace_id, user_id, current_user.id, db)

@router.patch("/workspace/{workspace_id}/members/{user_id}")
def update_workspace_member_role(workspace_id: int, user_id: int, data: UpdateWorkspaceMemberRoleRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return WorkspaceService.update_workspace_member_role(workspace_id, user_id, data.role, current_user.id, db)