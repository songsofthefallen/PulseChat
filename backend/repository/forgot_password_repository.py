from models import PasswordReset
from sqlalchemy.orm import Session

class ForgotPasswordRepository:

    @staticmethod
    def get_password_reset_by_user_id(user_id: int, db: Session):
        return db.query(PasswordReset).filter(PasswordReset.user_id == user_id).first()