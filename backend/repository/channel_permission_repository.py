from models import ChannelPermission
from sqlalchemy.orm import Session

class ChannelPermissionRepository:

    @staticmethod
    def create_channel_permission(channel_id: int, role: str, db: Session):
        channel_permission = ChannelPermission(channel_id=channel_id, role=role, can_view=True, can_send=True)

        db.add(channel_permission)
        db.flush()

        return channel_permission

    @staticmethod
    def get_channel_permission(channel_id: int, role: str, db: Session):
        return db.query(ChannelPermission).filter(ChannelPermission.channel_id == channel_id, ChannelPermission.role == role).first()

