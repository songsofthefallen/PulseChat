from models import Workspace, WorkspaceMember
from sqlalchemy.orm import Session, joinedload

class WorkspaceRepository:

    @staticmethod
    def create_workspace(name: str, user_id: int, db: Session):
        workspace = Workspace(name=name)

        db.add(workspace)
        db.flush()

        membership = WorkspaceMember(
            user_id=user_id,
            workspace_id=workspace.id,
            role="owner"
        )

        db.add(membership)

        return workspace

    @staticmethod
    def get_user_workspaces(user_id: int, db: Session):
        return db.query(Workspace).join(
            WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id).filter(
                WorkspaceMember.user_id == user_id
                ).all()

    @staticmethod
    def get_workspace_owner(workspace_id: int, user_id: int, db: Session):
        return db.query(Workspace).join(
            WorkspaceMember,
            WorkspaceMember.workspace_id == Workspace.id
            ).filter(
                Workspace.id == workspace_id,
                WorkspaceMember.user_id == user_id,
                WorkspaceMember.role == "owner"
                ).first()

    @staticmethod
    def get_workspace(workspace_id: int, db: Session):
        return db.query(Workspace).filter(
            Workspace.id == workspace_id
        ).first()

    @staticmethod
    def user_already_member(workspace_id: int, user_id: int, db):
        return db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user_id
        ).first()

    @staticmethod
    def get_workspace_member(workspace_id: int, user_id: int, db: Session):
        return db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user_id
        ).first()

    @staticmethod
    def get_workspace_members(workspace_id: int, db: Session):
        return db.query(WorkspaceMember).options(
            joinedload(WorkspaceMember.user)).filter(
                WorkspaceMember.workspace_id == workspace_id
            ).all()

    @staticmethod
    def is_workspace_owner(workspace_id: int, user_id: int, db: Session):
        return db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user_id,
            WorkspaceMember.role == "owner"
        ).first()