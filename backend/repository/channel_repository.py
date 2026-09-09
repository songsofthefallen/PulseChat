from models import Channel, WorkspaceMember
from sqlalchemy.orm import Session

class ChannelRepository:

    @staticmethod
    def is_channel_name_exist(workspace_id: int, name: str, db: Session):
        return db.query(Channel).filter(Channel.workspace_id == workspace_id, Channel.name == name).first()

    @staticmethod
    def create_channel(workspace_id: int, name: str, db: Session):
        channel = Channel(workspace_id=workspace_id, name=name)

        db.add(channel)
        db.flush()

        return channel

    @staticmethod
    def get_list_of_channels(workspace_id: int, user_id: int, db: Session):
        return db.query(Channel).join(WorkspaceMember, 
                WorkspaceMember.workspace_id == Channel.workspace_id,).filter(
                    Channel.workspace_id == workspace_id,
                    WorkspaceMember.user_id == user_id
                ).all()

    @staticmethod
    def channel_exist_in_workspace(workspace_id: int, channel_id: int, db: Session):
        return db.query(Channel).filter(Channel.workspace_id == workspace_id, Channel.id == channel_id).first()

    @staticmethod
    def is_channel_name_exist_for_update(workspace_id: int, channel_id: int, name: str, db: Session):
        return db.query(Channel).filter(Channel.workspace_id == workspace_id, Channel.name == name, Channel.id != channel_id).first()




