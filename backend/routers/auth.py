from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from schemas import RegisterUser, RegisterResponse, LoginUser, ForgotPasswordData, VerifyResetCodeRequest, ResetPasswordRequest
from services.auth import UserService
from services.password_reset_service import PasswordResetService
from database import get_db


router = APIRouter()

@router.post('/auth/register', response_model=RegisterResponse)
def register_user(user: RegisterUser, db:Session = Depends(get_db)):

    return UserService.register_user(user, db)

@router.post('/auth/login')
def login_user(response: Response, user: LoginUser, db:Session = Depends(get_db)):

    return UserService.login_user(response, user, db)

@router.post('/auth/forgot-password')
def forgot_password(email: ForgotPasswordData, db:Session = Depends(get_db)):

    return PasswordResetService.forgot_password(email.email, db)


@router.post('/auth/verify-reset-code')
def verify_reset_code(response: Response, data: VerifyResetCodeRequest, db: Session = Depends(get_db)):

    return PasswordResetService.verify_reset_code(response, data.email, data.code, db)

@router.post('/auth/reset-password')
def reset_password(response: Response, request: Request, data: ResetPasswordRequest, db: Session = Depends(get_db)):

    return PasswordResetService.reset_password(response, request, data.password, db)
