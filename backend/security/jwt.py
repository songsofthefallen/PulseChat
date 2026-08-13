from jose import jwt
from config import settings
from datetime import datetime, timedelta, UTC
from models import User
import secrets
import hashlib
from schemas import RefreshTokenData

JWT_KEY = settings.JWT_KEY

ALGO = "HS256"

class JwtService:

    @staticmethod
    def create_access_token(user: User, expires_delta: timedelta | None = None):
        if expires_delta is None:
            expires_delta = timedelta(minutes=10)

        expire = datetime.now(UTC) + expires_delta

        payload = {
            "sub": str(user.id),
            "type": "access",
            "exp": expire
        }

        token = jwt.encode(
            payload,
            JWT_KEY,
            algorithm=ALGO
        )

        return token

    @staticmethod
    def create_refresh_token(user: User, expires_delta: timedelta | None = None):
        if expires_delta is None:
            expires_delta = timedelta(days=30)

        expire = datetime.now(UTC) + expires_delta

        jti = secrets.token_hex(16)

        payload = {
            "sub": str(user.id),
            "type": "refresh",
            "jti": jti,
            "exp": expire
        }

        token = jwt.encode(
            payload,
            JWT_KEY,
            algorithm=ALGO
        )

        hash_token = hashlib.sha256(token.encode()).hexdigest()    

        return RefreshTokenData(
            hash_token=hash_token,
            token=token,
            jti=jti,
            expires_at=expire,
        )