from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from schemas import RegisterUser, RegisterResponse, LoginUser, ForgotPasswordData
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
    