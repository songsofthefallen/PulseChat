from models import RefreshToken
from sqlalchemy.orm import Session

class AuthRepository:
    @staticmethod
    def get_token_by_hash_token(hash_token: str, db: Session):
        return db.query(RefreshToken).filter(RefreshToken.token == hash_token).first()