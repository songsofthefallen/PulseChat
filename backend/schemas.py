from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    handle: str
    avatar_url: str | None = None
    bio: str | None = None
    status: str
    custom_status: str | None = None

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

class WorkspaceResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)