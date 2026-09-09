from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from schemas import SendMessageRequest, MessageResponse, UpdateMessageRequest
from services.message_service import MessageService


router = APIRouter()

@router.post("/workspaces/{workspace_id}/channels/{channel_id}/messages",response_model=MessageResponse)
def send_message( workspace_id: int, channel_id: int, message: SendMessageRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.send_message( workspace_id, channel_id, current_user.id, message.content, db)

@router.get("/workspaces/{workspace_id}/channels/{channel_id}/messages", response_model=list[MessageResponse])
def get_messages(workspace_id: int, channel_id: int, page: int = 1, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.get_messages(workspace_id, channel_id, page, current_user.id, db)

@router.patch("/workspaces/{workspace_id}/channels/{channel_id}/messages/{message_id}", response_model=MessageResponse)
def edit_message(workspace_id: int, channel_id: int, message_id: int, message: UpdateMessageRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.edit_message(workspace_id, channel_id, message_id, message.content, current_user.id, db)

@router.delete("/workspaces/{workspace_id}/channels/{channel_id}/messages/{message_id}")
def delete_message(workspace_id: int, channel_id: int, message_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.delete_message(workspace_id, channel_id, message_id, current_user.id, db)
