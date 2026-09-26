from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from services.notification_service import NotificationService
from schemas import NotificationResponse

router = APIRouter()

@router.get("/notifications", response_model=list[NotificationResponse])
def get_notifications(current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return NotificationService.get_user_notifications(current_user.id, db)

@router.get("/notifications/unread-count")
def get_unread_count(current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return {"count": NotificationService.get_unread_count(current_user.id, db)}

@router.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(notification_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return NotificationService.mark_as_read(notification_id, current_user.id, db)

@router.patch("/notifications/read-all")
def mark_all_notifications_as_read(current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    NotificationService.mark_all_as_read(current_user.id, db)

    return {"message": "All notifications marked as read"}