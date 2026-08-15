from jose import jwt, JWTError, ExpiredSignatureError
from config import settings
from fastapi import HTTPException
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

    def create_reset_password_token(user: User, expires_delta: timedelta | None = None):
            if expires_delta is None:
                expires_delta = timedelta(minutes=10)

            expire = datetime.now(UTC) + expires_delta
        
            payload = {
                "sub": str(user.id),
                "type": "reset_password",
                "exp": expire
            }
        
            token = jwt.encode(
                payload,
                JWT_KEY,
                algorithm=ALGO
            )
    
            return token

    def verify_reset_password_token(token):
        try:
            payload = jwt.decode(
                token,
                settings.JWT_KEY,
                algorithms=[ALGO]
            )

            if payload.get("type") != "reset_password":
                raise HTTPException(status_code=401, detail="Invalid Token Type")

            if payload.get("sub") is None:
                raise HTTPException(status_code=401, detail="Invalid token")

            return payload

        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")

        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
