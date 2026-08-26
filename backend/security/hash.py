import bcrypt
import hashlib
import secrets
from datetime import datetime, timedelta, UTC
from schemas import RefreshTokenData
from fastapi import HTTPException

class HashService:

    @staticmethod
    def hash_password(password):
        return bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

    @staticmethod
    def check_password(password, db_password):
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            db_password.encode('utf-8')
        ):
            raise HTTPException(status_code=401, detail="Incorrect Password")

    @staticmethod
    def create_refresh_token():

        refresh_token = secrets.token_urlsafe(32)

        expires_delta = timedelta(days=30)

        expire = datetime.now(UTC) + expires_delta

        jti = secrets.token_hex(16)

        hash_token = hashlib.sha256(refresh_token.encode()).hexdigest()

        return RefreshTokenData(
            hash_token=hash_token,
            token=refresh_token,
            jti=jti,
            expires_at=expire,
        )

    @staticmethod
    def create_reset_password_token():

        reset_password_token = secrets.token_urlsafe(32)

        hash_reset_token = hashlib.sha256(reset_password_token.encode()).hexdigest()

        return reset_password_token, hash_reset_token

    @staticmethod
    def hash_token(token):
        return hashlib.sha256(token.encode()).hexdigest()

    
    @staticmethod
    def hash_code(code):
        return bcrypt.hashpw(
            code.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

    @staticmethod
    def verify_code(code, db_code):
        if not bcrypt.checkpw(
            code.encode('utf-8'),
            db_code.encode('utf-8')
        ):
            raise HTTPException(status_code=401, detail="Incorrect Code")