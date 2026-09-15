from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from schemas import DMConversationResponse
from services.DMConversation_service import DMConversationService


router = APIRouter()

@router.post("/dms", response_model=DMConversationResponse)
def create_or_get_conversation(user_ids: list[int] = Query(), current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DMConversationService.create_or_get_conversation(user_ids, current_user, db)

@router.get("/dms", response_model=list[DMConversationResponse])
def get_conversations(current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return DMConversationService.get_conversations(current_user.id, db)



