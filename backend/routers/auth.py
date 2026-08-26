from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from schemas import RegisterUser, RegisterResponse, LoginUser, ForgotPasswordData, VerifyResetCodeRequest, ResetPasswordRequest, UserResponse
from services.auth import AuthService
from services.password_reset_service import PasswordResetService
from database import get_db
from models import User


router = APIRouter()

@router.post('/auth/register', response_model=RegisterResponse)
def register_user(user: RegisterUser, db:Session = Depends(get_db)):

    return AuthService.register_user(user, db)

@router.post('/auth/login')
def login_user(response: Response, user: LoginUser, db:Session = Depends(get_db)):

    return AuthService.login_user(response, user, db)

@router.post('/auth/forgot-password')
def forgot_password(email: ForgotPasswordData, db:Session = Depends(get_db)):

    return PasswordResetService.forgot_password(email.email, db)


@router.post('/auth/verify-reset-code')
def verify_reset_code(response: Response, data: VerifyResetCodeRequest, db: Session = Depends(get_db)):

    return PasswordResetService.verify_reset_code(response, data.email, data.code, db)

@router.post('/auth/reset-password')
def reset_password(response: Response, request: Request, data: ResetPasswordRequest, db: Session = Depends(get_db)):

    return PasswordResetService.reset_password(response, request, data.password, db)

@router.get('/auth/me', response_model=UserResponse)
def get_me(current_user: User = Depends(AuthService.get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.username,
        handle=current_user.handle,
        avatar_url=current_user.avatar_url,
        bio=current_user.bio,
        status=current_user.status,
        custom_status=current_user.custom_status,
    )

@router.post("/refresh")
def refresh_access_token(request: Request, db: Session = Depends(get_db)):

    return AuthService.refresh_access_token(request, db)
