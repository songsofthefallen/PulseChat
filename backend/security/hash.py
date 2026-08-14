import bcrypt
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