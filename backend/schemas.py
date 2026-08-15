from pydantic import BaseModel, EmailStr
from datetime import datetime

class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr

class RegisterResponse(BaseModel):
    message: str
    user: UserResponse

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class RefreshTokenData(BaseModel):
    hash_token: str
    token: str
    jti: str
    expires_at: datetime

class ForgotPasswordData(BaseModel):
    email: EmailStr


class VerifyResetCodeRequest(BaseModel):
    email: EmailStr
    code: str

class ResetPasswordRequest(BaseModel):
    password: str