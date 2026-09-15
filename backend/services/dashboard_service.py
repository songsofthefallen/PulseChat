from sqlalchemy.orm import Session
from models import  PinnedChannel
from repository.dashboard_repository import DashboardRepository
from fastapi import HTTPException

class DashboardService:

    @staticmethod
    def get_one_workspace(workspace_id: int, user_id: int, db: Session):
        workspace = DashboardRepository.get_one_workspace(workspace_id, user_id, db)
        if workspace is None:
            raise HTTPException(status_code=404, detail='Workspace Doesnt Exist')
        return workspace

    @staticmethod
    def get_one_channel(workspace_id: int, channel_id: int, user_id: int, db: Session):
        channel = DashboardRepository.get_one_channel(workspace_id, channel_id, user_id, db)
        if channel is None:
            raise HTTPException(status_code=404, detail='Channel Not Found')
        return channel

    @staticmethod
    def get_channel_for_user(channel_id: int, user_id: int, db: Session):
        channel = DashboardRepository.get_channel_for_user(channel_id, user_id, db)
        if channel is None:
            raise HTTPException(status_code=404, detail='Channel Not Found')
        return channel

    @staticmethod
    def get_recent_conversations(user_id: int, db: Session):

        return DashboardRepository.get_recent_conversations(user_id, db)

    @staticmethod
    def get_pinned_channels(user_id: int, db: Session):

        return DashboardRepository.get_pinned_channels(user_id, db)

    @staticmethod
    def pin_channel(user_id: int, channel_id: int, db: Session):
        pinned_channel = PinnedChannel(user_id=user_id, channel_id=channel_id)

        db.add(pinned_channel)
        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        return pinned_channel

    @staticmethod
    def unpin_channel(user_id: int, channel_id: int, db: Session):
        pinned_channel = DashboardRepository.get_pin_channel(user_id, channel_id, db)

        if pinned_channel is None:
            raise HTTPException(status_code=404, detail="Channel is not pinned")

        db.delete(pinned_channel)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        return True


    