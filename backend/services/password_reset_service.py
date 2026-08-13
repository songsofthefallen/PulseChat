from sqlalchemy.orm import Session
from services.auth import UserService
import secrets
from datetime import datetime, timedelta, UTC
import secrets
from datetime import datetime, timedelta, UTC
from models import PasswordReset
from security.hash import HashService
from services.email_service import EmailService
from repository.user_repository import UserRepository

class PasswordResetService:
    @staticmethod
    def forgot_password(email: str, db: Session):
        user = UserRepository.get_by_email(email, db)
            
        code = f"{secrets.randbelow(1_000_000):06d}"

        hashed_code = HashService.hash_code(code)

        now = datetime.now(UTC)

        expire = now + timedelta(minutes=10)

        password_reset = PasswordReset(user_id = user.id, code_hash = hashed_code, expires_at= expire, created_at = now)

        db.add(password_reset)
        try:
            db.commit()
        except:
            db.rollback()
            raise

        EmailService.send_password_reset_code(email, code)

        return {
            "Message": "Code Successfully Sent Check your Email"
        }
