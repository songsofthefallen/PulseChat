from fastapi import HTTPException
from models import User
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from schemas import UpdateProfileRequest
from repository.user_repository import UserRepository

class UserService:
    @staticmethod
    def update_profile(data: UpdateProfileRequest, current_user: User, db: Session):

        if "username" in data.model_fields_set:
            
            if data.username != current_user.username:
                
                existing_user = UserRepository.username_exist(data, current_user, db)

                if existing_user:
                    raise HTTPException(status_code=409, detail="Username already exists")

                current_user.username = data.username


        if "handle" in data.model_fields_set:

            if data.handle != current_user.handle:
            
                existing_user = UserRepository.handle_exist(data, current_user, db)

                if existing_user:
                    raise HTTPException(status_code=409, detail="Handle already exists")

                current_user.handle = data.handle

        if "avatar_url" in data.model_fields_set:
            current_user.avatar_url = data.avatar_url

        if "bio" in data.model_fields_set:
            current_user.bio = data.bio

        try:
            db.commit()
            db.refresh(current_user)
        except SQLAlchemyError:
            db.rollback()
            raise

        return current_user