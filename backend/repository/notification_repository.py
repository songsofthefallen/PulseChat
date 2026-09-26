from sqlalchemy.orm import Session
from models import Notification, User, DMMessage

class NotificationRepository:

    @staticmethod
    def create_notification(notification: Notification, db: Session):
        db.add(notification)
        db.flush()
        return notification

    @staticmethod
    def get_user_notifications(user_id: int, db: Session):
        return (
            db.query(Notification, User.username, DMMessage.content)
            .outerjoin(User, User.id == Notification.actor_id)
            .outerjoin(DMMessage, DMMessage.id == Notification.dm_message_id)
            .filter(Notification.recipient_id == user_id)
            .order_by(Notification.created_at.desc())
            .all()
        )
        
    @staticmethod
    def get_unread_notifications(user_id: int, db: Session):
        return db.query(Notification).filter(Notification.recipient_id == user_id,Notification.is_read == False).order_by(Notification.created_at.desc()).all()
        

    @staticmethod
    def mark_as_read(notification_id: int, user_id: int, db: Session):
        notification = db.query(Notification).filter(Notification.id == notification_id,Notification.recipient_id == user_id).first()
        
        if notification:
            notification.is_read = True

        return notification

    @staticmethod
    def get_unread_count(user_id: int, db: Session):
        return db.query(Notification).filter(Notification.recipient_id == user_id,Notification.is_read == False).count()

    @staticmethod
    def mark_all_as_read(user_id: int, db: Session):
        notifications = (
            db.query(Notification)
            .filter(
                Notification.recipient_id == user_id,
                Notification.is_read == False
            )
            .all()
        )

        for notification in notifications:
            notification.is_read = True

        return notifications
        