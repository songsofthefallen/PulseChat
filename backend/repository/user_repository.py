from sqlalchemy.orm import Session
from models import User, RefreshToken

class UserRepository:

    @staticmethod
    def get_by_username(username: str, db: Session):
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_by_email(email: str, db: Session):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_id(id: int, db: Session):
        return db.query(User).filter(User.id == id).first()


