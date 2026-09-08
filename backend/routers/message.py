from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from schemas import SendMessageRequest, MessageResponse
from services.message_service import MessageService


router = APIRouter()

@router.post("/workspaces/{workspace_id}/channels/{channel_id}/messages",response_model=MessageResponse)
def send_message( workspace_id: int, channel_id: int, message: SendMessageRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.send_message( workspace_id, channel_id, current_user.id, message.content, db)

