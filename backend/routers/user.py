from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from schemas import  UserResponse, UpdateProfileRequest, UserPresenceResponse, UserResponse
from services.auth_service import AuthService
from database import get_db
from models import User
from services.user_service import UserService
import redis
from dependencies import Dependencies
from services.presence_service import PresenceService
from services.auth_service import AuthService
from repository.user_repository import UserRepository


router = APIRouter()

@router.get('/users', response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):

    return UserRepository.get_all_users(db)

@router.get('/users/me', response_model=UserResponse)
def get_me(current_user: User = Depends(AuthService.get_current_user)):

    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        handle=current_user.handle,
        avatar_url=current_user.avatar_url,
        bio=current_user.bio,
        status=current_user.status,
        custom_status=current_user.custom_status,
    )

@router.patch('/users/me', response_model=UserResponse)
def update_me(data: UpdateProfileRequest, current_user: User = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):

    return UserService.update_profile(data, current_user, db)


@router.post('/users/me/heartbeat')
def heartbeat(current_user: User = Depends(AuthService.get_current_user), redis_client: redis.Redis = Depends(Dependencies.get_redis)):

    PresenceService.set_online(user_id=current_user.id, redis_client=redis_client)

    return {"status": "online"}

@router.get('/users/presence', response_model=list[UserPresenceResponse])
def presence(user_ids: list[int] = Query(), redis_client: redis.Redis = Depends(Dependencies.get_redis)):

    return PresenceService.get_users_presence(user_ids, redis_client)
