from sqlalchemy.orm import Session, joinedload
from models import Workspace, WorkspaceMember, Channel, Message

class WorkspaceRepository:

    @staticmethod
    def get_list_of_workspace(user_id: int, db: Session):
        return db.query(Workspace).join(
            WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id).filter(
                WorkspaceMember.user_id == user_id
            ).all()

    @staticmethod
    def get_one_workspace(workspace_id: int, user_id: int, db: Session):
        return db.query(Workspace).join(
            WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id).filter(
                    Workspace.id == workspace_id,
                    WorkspaceMember.user_id == user_id
                ).first()
    @staticmethod
    def get_list_of_channels(workspace_id: int, user_id: int, db: Session):
        return db.query(Channel).join(WorkspaceMember, 
                WorkspaceMember.workspace_id == Channel.workspace_id,).filter(
                    Channel.workspace_id == workspace_id,
                    WorkspaceMember.user_id == user_id
                ).all()

    @staticmethod
    def get_one_channel(workspace_id: int, channel_id: int, user_id: int, db: Session):
        return db.query(Channel).join(
            WorkspaceMember, WorkspaceMember.workspace_id == Channel.workspace_id).filter(
                Channel.workspace_id == workspace_id,
                WorkspaceMember.user_id == user_id,
                Channel.id == channel_id
            ).first()

    @staticmethod
    def get_list_of_messages(workspace_id: int, channel_id: int, user_id:int, db: Session):
        return db.query(Message).join(
            Channel, Channel.id == Message.channel_id).join(
                WorkspaceMember, WorkspaceMember.workspace_id == Channel.workspace_id
                    ).options(
                        joinedload(Message.user)
                        ).filter(
                            WorkspaceMember.user_id == user_id,
                            Channel.workspace_id == workspace_id,
                            Message.channel_id == channel_id
                        ) .order_by(Message.created_at.asc()).all()

