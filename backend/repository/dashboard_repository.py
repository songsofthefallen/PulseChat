from sqlalchemy.orm import Session, joinedload
from models import Workspace, WorkspaceMember, Channel, Message, PinnedChannel

class DashboardRepository:
    @staticmethod
    def get_one_workspace(workspace_id: int, user_id: int, db: Session):
        return db.query(Workspace).join(
            WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id).filter(
                    Workspace.id == workspace_id,
                    WorkspaceMember.user_id == user_id
                ).first()
    

    @staticmethod
    def get_one_channel(workspace_id: int, channel_id: int, user_id: int, db: Session):
        return db.query(Channel).join(
            WorkspaceMember, WorkspaceMember.workspace_id == Channel.workspace_id).filter(
                Channel.workspace_id == workspace_id,
                WorkspaceMember.user_id == user_id,
                Channel.id == channel_id
            ).first()

    @staticmethod
    def get_channel_for_user(channel_id: int, user_id: int, db: Session):
        return db.query(Channel).join(
            WorkspaceMember,
            WorkspaceMember.workspace_id == Channel.workspace_id
        ).filter(
            Channel.id == channel_id,
            WorkspaceMember.user_id == user_id
        ).first()

    @staticmethod
    def get_recent_conversations(user_id: int, db: Session):
        return (db.query(Message).join(
            Channel, Channel.id == Message.channel_id).join(
                WorkspaceMember,
                WorkspaceMember.workspace_id == Channel.workspace_id
                ).options(
                    joinedload(Message.user),
                    joinedload(Message.channel),
                    ).filter(
                        WorkspaceMember.user_id == user_id).order_by(
                            Message.created_at.desc()).limit(5).all())

    @staticmethod
    def get_pinned_channels(user_id: int, db: Session):
        return db.query(Channel).join(
            PinnedChannel,
            PinnedChannel.channel_id == Channel.id
            ).join(
                WorkspaceMember,
                WorkspaceMember.workspace_id == Channel.workspace_id
                ).filter(
                    PinnedChannel.user_id == user_id,
                    WorkspaceMember.user_id == user_id).all()
        

    @staticmethod
    def get_pin_channel(user_id: int, channel_id: int, db: Session):
        return db.query(PinnedChannel).filter(
            PinnedChannel.user_id == user_id,
            PinnedChannel.channel_id == channel_id
                ).first()