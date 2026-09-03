from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Literal
from datetime import datetime

class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    handle: str
    avatar_url: str | None = None
    bio: str | None = None
    status: str
    custom_status: str | None = None

    model_config = ConfigDict(from_attributes=True)

class UpdateProfileRequest(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=100)
    handle: str | None = Field(default=None, min_length=3, max_length=100)
    avatar_url: str | None = Field(default=None, max_length=500)
    bio: str | None = Field(default=None, max_length=500)

class RegisterResponse(BaseModel):
    message: str
    user: UserResponse

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class RefreshTokenData(BaseModel):
    hash_token: str
    token: str
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

class MessageUserResponse(BaseModel):
    id: int
    username: str
    avatar_url: str | None = None

    model_config = ConfigDict(from_attributes=True)

class MessageResponse(BaseModel):
    id: int
    channel_id: int
    content: str
    created_at: datetime
    user: MessageUserResponse

    model_config = ConfigDict(from_attributes=True)

class RecentConversationChannelResponse(BaseModel):
    id: int
    workspace_id: int
    name: str
    
    model_config = ConfigDict(from_attributes=True)


class RecentConversationResponse(BaseModel):
    id: int
    channel_id: int
    content: str
    created_at: datetime
    user: MessageUserResponse
    channel: RecentConversationChannelResponse

    model_config = ConfigDict(from_attributes=True)
    
class SendMessageRequest(BaseModel):
    content: str

class UserPresenceResponse(BaseModel):
    user_id: int
    status: Literal["online", "offline"]

