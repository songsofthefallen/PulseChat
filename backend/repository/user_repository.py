from sqlalchemy.orm import Session
from models import User, RefreshToken
from schemas import  UserResponse, UpdateProfileRequest

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

    @staticmethod
    def username_exist(data: UpdateProfileRequest,current_user: User, db: Session):
        return  db.query(User).filter(User.username == data.username, User.id != current_user.id).first()

    @staticmethod
    def handle_exist(data: UpdateProfileRequest,current_user: User, db: Session):
        return db.query(User).filter(User.handle == data.handle, User.id != current_user.id).first()

    @staticmethod
    def get_all_users(db: Session):
        return db.query(User).all()
    
    @staticmethod
    def get_users_by_ids( user_ids: list[int],db: Session):
        return db.query(User).filter(User.id.in_(user_ids)).all()
        




