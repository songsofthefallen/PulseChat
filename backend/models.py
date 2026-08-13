from sqlalchemy import String, Integer, DateTime, Column, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base, engine

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(100), nullable=False, unique=True)
    email = Column(String(200), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)

    tokens = relationship('RefreshToken', back_populates='user', cascade='all, delete-orphan')
    password_resets = relationship('PasswordReset', back_populates='user')

class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'
    id = Column(Integer, primary_key=True)
    token = Column(String(255), unique=True, nullable=False)
    jti = Column(String(64))
    user_id = Column(Integer, ForeignKey("users.id"))
    expires_at = Column(DateTime)
    revoked = Column(Boolean, default=False)

    user = relationship('User', back_populates='tokens')

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey("users.id"), nullable=False)
    code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, nullable=False)

    user = relationship('User', back_populates='password_resets')
