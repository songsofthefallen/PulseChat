from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Notification
from repository.notification_repository import NotificationRepository
from schemas import NotificationType

class NotificationService:

    @staticmethod
    def create_notification(recipient_id: int, actor_id: int, notification_type: str, db: Session, workspace_id: int | None = None, channel_id: int | None = None, conversation_id: int | None = None, message_id: int | None = None, dm_message_id: int | None = None):

        notification = Notification(recipient_id=recipient_id, actor_id=actor_id, type=notification_type, workspace_id=workspace_id, channel_id=channel_id, conversation_id=conversation_id, message_id=message_id,  dm_message_id=dm_message_id)

        return NotificationRepository.create_notification(notification, db)

    @staticmethod
    def get_user_notifications(user_id: int, db: Session):
        notifications = NotificationRepository.get_user_notifications(user_id, db)

        return [
            {
                "id": notification.id,
                "recipient_id": notification.recipient_id,
                "actor_id": notification.actor_id,
                "type": notification.type,
                "workspace_id": notification.workspace_id,
                "channel_id": notification.channel_id,
                "conversation_id": notification.conversation_id,
                "message_id": notification.message_id,
                "dm_message_id": notification.dm_message_id,
                "is_read": notification.is_read,
                "created_at": notification.created_at,
                "actor_username": username,
                "message_content": content,
            }
            for notification, username, content in notifications
        ]

    @staticmethod
    def get_unread_count(user_id: int, db: Session):
        return NotificationRepository.get_unread_count(user_id, db)

    @staticmethod
    def mark_as_read(notification_id: int, user_id: int, db: Session):
        notification = NotificationRepository.mark_as_read(notification_id, user_id, db)

        if notification is None:
            raise HTTPException(status_code=404, detail="Notification not found")

        try:
            db.commit()
            db.refresh(notification)
        except Exception:
            db.rollback()
            raise

        return notification

    @staticmethod
    def mark_all_as_read(user_id: int, db: Session):
        notifications = NotificationRepository.mark_all_as_read(user_id, db)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        return notifications

    @staticmethod
    def notify_message(recipient_id: int, actor_id: int, conversation_id: int, dm_message_id: int, db: Session):
        return NotificationService.create_notification(
            recipient_id=recipient_id,
            actor_id=actor_id,
            notification_type=NotificationType.MESSAGE,
            conversation_id=conversation_id,
            dm_message_id=dm_message_id,
            db=db
        )