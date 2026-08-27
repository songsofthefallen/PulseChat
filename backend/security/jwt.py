from jose import jwt, JWTError, ExpiredSignatureError
from config import settings
from fastapi import HTTPException
from datetime import datetime, timedelta, UTC
from models import User

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
    def verify_access_token(token):
        try:
            payload = jwt.decode(
                token,
                JWT_KEY,
                algorithms=[ALGO]
            )

            if payload.get("type") != "access":
                raise HTTPException(status_code=401, detail="Invalid Token Type")

            if payload.get("sub") is None:
                raise HTTPException(status_code=401, detail="Invalid token")

            return payload
        
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")

        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
