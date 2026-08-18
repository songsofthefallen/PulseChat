from sqlalchemy.orm import Session
from models import User
from repository.workspace_repository import WorkspaceRepository
from fastapi import HTTPException

class WorkspaceService:

    @staticmethod
    def get_user_workspaces(current_user: User, db: Session):
        workspaces = WorkspaceRepository.get_list_workspace(current_user.id, db)

        return workspaces

    @staticmethod
    def get_channels(workspace_id: int, current_user: User, db: Session):
        workspace = WorkspaceRepository.get_channels_in_workspace(workspace_id, current_user.id, db)
        if not workspace:
            raise HTTPException(status_code=404, detail='Workspace Doesnt Exist')
        return workspace