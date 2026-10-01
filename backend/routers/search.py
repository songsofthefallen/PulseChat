from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from services.search_service import SearchService

router = APIRouter()

@router.get("/search")
def search(content: str, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return SearchService.search_globally(content, current_user.id, db)