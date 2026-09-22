from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from schemas import MessageResponse, UpdateMessageRequest, MessageReadResponse
from services.message_service import MessageService



router = APIRouter()

@router.post("/workspaces/{workspace_id}/channels/{channel_id}/messages", response_model=MessageResponse)
async def send_message( workspace_id: int, channel_id: int, content: str = Form(), file: UploadFile | None = File(None), current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return await MessageService.send_message( workspace_id, channel_id, content, file, current_user.id, db)

@router.get("/workspaces/{workspace_id}/channels/{channel_id}/messages", response_model=list[MessageResponse])
def get_messages(workspace_id: int, channel_id: int, before_id: int | None = None, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.get_messages(workspace_id, channel_id, current_user.id,before_id, db)

@router.patch("/workspaces/{workspace_id}/channels/{channel_id}/messages/{message_id}", response_model=MessageResponse)
def edit_message(workspace_id: int, channel_id: int, message_id: int, message: UpdateMessageRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.edit_message(workspace_id, channel_id, message_id, message.content, current_user.id, db)

@router.delete("/workspaces/{workspace_id}/channels/{channel_id}/messages/{message_id}")
def delete_message(workspace_id: int, channel_id: int, message_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return MessageService.delete_message(workspace_id, channel_id, message_id, current_user.id, db)

@router.post("/workspaces/{workspace_id}/channels/{channel_id}/messages/{message_id}/read")
async def mark_message_as_read(workspace_id: int, channel_id: int, message_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return await MessageService.mark_message_as_read(workspace_id, channel_id, message_id, current_user, db)

@router.get("/workspaces/{workspace_id}/channels/{channel_id}/read", response_model=list[MessageReadResponse])
def get_read_messages(workspace_id: int,channel_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):
    return MessageService.get_read_messages(workspace_id, channel_id, current_user.id, db)
