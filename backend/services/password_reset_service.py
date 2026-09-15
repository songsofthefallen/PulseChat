from fastapi import HTTPException, Response, Request
from sqlalchemy.orm import Session
from services.auth_service import AuthService
import secrets
from datetime import datetime, timedelta, UTC
import secrets
from models import PasswordReset
from security.hash import HashService
from services.email_service import EmailService
from repository.user_repository import UserRepository
from repository.auth_repository import AuthRepository


class PasswordResetService:

    @staticmethod
    def forgot_password(email: str, db: Session):
        user = UserRepository.get_by_email(email, db)
            
        code = f"{secrets.randbelow(1_000_000):06d}"

        hashed_code = HashService.hash_code(code)

        now = datetime.now(UTC)

        expire = now + timedelta(minutes=10)

        db_password_reset = AuthRepository.get_password_reset_by_user_id(user.id, db)

        if db_password_reset:

            db_password_reset.code_hash = hashed_code

            db_password_reset.expires_at = expire

            db_password_reset.created_at = now

            db_password_reset.used = False

            db_password_reset.reset_token_hash = None

        else:

            password_reset = PasswordReset(user_id = user.id, code_hash = hashed_code, expires_at= expire, created_at = now)

            db.add(password_reset)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        EmailService.send_password_reset_code(email, code)

        return {
            "Message": "Code Successfully Sent Check your Email"
        }

    @staticmethod
    def verify_not_expired(row):
        now = datetime.now(UTC)
        expire = PasswordResetService.ensure_utc(row.expires_at)


        if now >= expire:
            raise HTTPException(
                status_code=400,
                detail="Reset code has expired"
    )
        
    @staticmethod
    def ensure_utc(value: datetime) -> datetime:
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC)

        return value.astimezone(UTC)

    @staticmethod
    def verify_reset_code(response, email: str, code: str, db: Session):
        user = AuthService.find_user_by_email(email, db)

        password_reset_row = AuthRepository.get_password_reset_by_user_id(user.id, db)

        HashService.verify_code(code, password_reset_row.code_hash)

        PasswordResetService.verify_not_expired(password_reset_row)

        reset_token, hash_token = HashService.create_reset_password_token()

        password_reset_row.reset_token_hash = hash_token

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise


        response.set_cookie(
            key="password_reset_token",
            value=reset_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=600,
        )

        return {"message": "Code verified"}

    @staticmethod
    def reset_password(response: Response, request: Request, new_password: str, db: Session):

            reset_token = request.cookies.get("password_reset_token")

            if reset_token is None:
                raise HTTPException(status_code=401, detail="Invalid reset session")

            hash_token = HashService.hash_token(reset_token)

            password_reset = AuthRepository.get_password_reset_by_token(hash_token, db)

            if password_reset is None:
                raise HTTPException(status_code=401, detail="Invalid reset token")

            PasswordResetService.verify_not_expired(password_reset)

            user = AuthService.find_user_by_id(password_reset.user_id, db)

            user.hashed_password = HashService.hash_password(new_password)

            password_reset.used = True

            try:
                db.commit()
            except Exception:
                db.rollback()
                raise

            response.delete_cookie("password_reset_token")

            return {"message": "Password Successfully Changed"}
