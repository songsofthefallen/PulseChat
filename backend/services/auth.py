from fastapi import HTTPException, Response, Request, Depends
from database import get_db
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from repository.user_repository import UserRepository
from repository.auth_repository import AuthRepository
from models import User, RefreshToken
from schemas import RegisterUser, LoginUser
from security.hash import HashService
from security.jwt import JwtService
from datetime import datetime, UTC


class AuthService:

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
    
    def find_user_by_id(id: int, db: Session):
        db_user = UserRepository.get_by_id(id, db)

        if not db_user:
            raise HTTPException(status_code=404, detail="User Not Found")

        return db_user   


    @staticmethod
    def register_user(user: RegisterUser, db: Session):

        AuthService.username_already_exist(user.username, db)

        AuthService.email_already_exist(user.email, db)

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

        db_user = AuthService.find_user_by_email(user.email, db)

        HashService.check_password(user.password, db_user.hashed_password)

        access_token = JwtService.create_access_token(db_user)

        refresh = HashService.create_refresh_token()

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
            secure=False,  #testing
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

    @staticmethod
    def get_current_user(request: Request,  db: Session = Depends(get_db)):

        token = request.cookies.get("access_token")

        if token is None:
            raise HTTPException(status_code=401, detail="Not authenticated")

        payload = JwtService.verify_access_token(token)

        user_id = payload["sub"]

        user = UserRepository.get_by_id(user_id, db)

        if user is None:
            raise HTTPException(status_code=404, detail="User not Found")

        return user

    @staticmethod
    def refresh_access_token(request: Request, db: Session):

        token = request.cookies.get("refresh_token")

        if token is None:
            raise HTTPException(status_code=401, detail="Not authenticated")

        hash_token = HashService.hash_token(token)

        db_refresh_token = AuthRepository.get_token_by_hash_token(hash_token, db)

        if db_refresh_token is None:
            raise HTTPException(status_code=401, detail="Not authenticated")
    
        if db_refresh_token.expires_at <= datetime.now(UTC):
            raise HTTPException(401, "Refresh token expired")

        if db_refresh_token.revoked:
            raise HTTPException(401, "Refresh token revoked")

        user = AuthService.find_user_by_id(db_refresh_token.user_id, db)

        new_access_token = JwtService.create_access_token(user)

        new_refresh_token = JwtService.create_refresh_token(user)

        db_refresh_token.token = new_refresh_token.hash_token

        db_refresh_token.jti = new_refresh_token.jti



        try:
            db.commit()
        except:
            db.rollback()
            raise

        return {
        "access_token": new_access_token,
        "token_type": "bearer"
        }

        


