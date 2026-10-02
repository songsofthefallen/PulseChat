from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_service import AuthService
from services.search_service import SearchService
from schemas import GlobalSearchResponse

router = APIRouter()

@router.get("/search", response_model=GlobalSearchResponse)
def global_search(q: str, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return SearchService.search_globally(q, current_user.id, db)