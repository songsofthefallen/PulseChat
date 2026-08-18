from sqlalchemy.orm import Session
from models import Workspace, WorkspaceMember, Channel

class WorkspaceRepository:

    @staticmethod
    def get_list_workspace(user_id: int, db: Session):
        return db.query(Workspace).join(
            WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id).filter(
                WorkspaceMember.user_id == user_id).all()

    @staticmethod
    def get_channels_in_workspace(workspace_id: int, user_id: int, db: Session):
        return db.query(Channel).join(WorkspaceMember, 
                WorkspaceMember.workspace_id == Channel.workspace_id,).filter(
                    Channel.workspace_id == workspace_id,
                    WorkspaceMember.user_id == user_id,
                    WorkspaceMember.workspace_id == workspace_id).all()