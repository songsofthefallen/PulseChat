from sqlalchemy.orm import Session
from models import User

class UserRepository:

    @staticmethod
    def get_by_username(username: str, db: Session):
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_by_email(email: str, db: Session):
        return db.query(User).filter(User.email == email).first()