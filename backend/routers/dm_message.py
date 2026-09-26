from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import  DMMessageResponse
from services.auth_service import AuthService
from services.DMMessage_service import DMMessageService


router = APIRouter()

@router.post("/dms/{conversation_id}/messages", response_model=DMMessageResponse)
async def create_direct_message(conversation_id: int, content: str = Form(), file: UploadFile | None = File(None), current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return await DMMessageService.create_direct_message(conversation_id, content, file, current_user.id, db)

@router.get("/dms/{conversation_id}/messages", response_model=list[DMMessageResponse])
def get_direct_messages(conversation_id: int, page: int = 1, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DMMessageService.get_direct_messages(conversation_id, page, current_user.id, db)


@router.patch("/dms/{conversation_id}/messages/{message_id}", response_model=DMMessageResponse)
def edit_direct_message(conversation_id: int, message_id: int, content: str = Form(), current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DMMessageService.edit_direct_message(conversation_id, message_id, message.content, current_user.id, db)

@router.delete("/dms/{conversation_id}/messages/{message_id}")
def delete_direct_message(conversation_id: int, message_id: int, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DMMessageService.delete_direct_message(conversation_id, message_id,  current_user.id, db)