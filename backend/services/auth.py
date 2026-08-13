from fastapi import HTTPException, Response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from repository.user_repository import UserRepository
from models import User, RefreshToken
from schemas import RegisterUser, LoginUser
from security.hash import HashService
from security.jwt import JwtService


class UserService:

    @staticmethod
    def username_already_exist(username: str, db: Session):
        db_user = UserRepository.get_by_username(username, db)

        if db_user:
            raise HTTPException(status_code = 409, detail="Username is already taken")

    @staticmethod
    def email_already_exist(email: str, db: Session):
        db_user = UserRepository.get_by_email(email, db)

        if db_user:
            raise HTTPException(status_code = 409, detail="Email already registered")

    @staticmethod
    def find_user_by_email(email: str, db: Session):
        db_user = UserRepository.get_by_email(email, db)

        if not db_user:
            raise HTTPException(status_code=404, detail="User Not Found")

        return db_user

    @staticmethod
    def register_user(user: RegisterUser, db: Session):

        UserService.username_already_exist(user.username, db)

        UserService.email_already_exist(user.email, db)

        hashed_password = HashService.hash_password(user.password)

        save_user = User(username = user.username, email = user.email, hashed_password=hashed_password)

        db.add(save_user)
        try:
            db.commit()
            db.refresh(save_user)

        except IntegrityError:
            db.rollback()

            raise HTTPException(
                status_code=409,
                detail="Username or email already exists"
            )

        return {
            "message": "User registered successfully",
            "user": save_user
        }

    @staticmethod
    def login_user(response: Response, user: LoginUser, db: Session):

        db_user = UserService.find_user_by_email(user.email, db)

        HashService.check_password(user.password, db_user.hashed_password)

        access_token = JwtService.create_access_token(db_user)

        refresh = JwtService.create_refresh_token(db_user)

        refresh_token = RefreshToken(token = refresh.hash_token, jti = refresh.jti, user_id = db_user.id, expires_at = refresh.expires_at)

        response.set_cookie(
            key="refresh_token",
            value=refresh.token,
            httponly=True,
            secure=True,
            samesite='lax',
            max_age =  60 * 60 * 24 * 30
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True, #make this false for integration test to work
            samesite='lax',
            max_age =  900
        )

        db.add(refresh_token)
        try:
            db.commit()
        except:
            db.rollback()
            raise

        return {
            "access_token": access_token,
            "refresh_token": refresh.token,
            "token_type": "bearer"
        }




