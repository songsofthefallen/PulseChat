from sqlalchemy import String, Integer, DateTime, Column, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, UTC

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(100), nullable=False, unique=True)
    email = Column(String(200), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)

    handle = Column(String(100), nullable=False, unique=True)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(String(500), nullable=True)
    status = Column(String(50), nullable=False, default="offline")
    custom_status = Column(String(255), nullable=True)

    tokens = relationship('RefreshToken', back_populates='user', cascade='all, delete-orphan')
    password_resets = relationship('PasswordReset', back_populates='user')
    workspace_members = relationship("WorkspaceMember" ,back_populates="user", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="user")
 
class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'
    
    id = Column(Integer, primary_key=True)
    token = Column(String(255), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    expires_at = Column(DateTime)
    revoked = Column(Boolean, default=False)

    user = relationship('User', back_populates='tokens')

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey("users.id"), nullable=False)
    code_hash = Column(String(255), nullable=False)
    reset_token_hash = Column(String(64), nullable=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, nullable=False)

    user = relationship('User', back_populates='password_resets')

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)

    members = relationship("WorkspaceMember",back_populates="workspace", cascade="all, delete-orphan")
    channels = relationship("Channel", back_populates="workspace", cascade="all, delete-orphan")

class WorkspaceMember(Base):
    __tablename__ = "workspace_members"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True) #fk for pointing it to user and composite primary key to avoid duplication, non null and unique

    workspace_id = Column(Integer,ForeignKey("workspaces.id", ondelete="CASCADE"), primary_key=True)

    user = relationship("User", back_populates="workspace_members")
    workspace = relationship("Workspace", back_populates="members")

class Channel(Base):
    __tablename__ = "channels"

    id = Column(Integer, primary_key=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)

    workspace = relationship("Workspace",back_populates="channels")
    messages = relationship("Message",back_populates="channel",cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    channel_id = Column(Integer,ForeignKey("channels.id", ondelete="CASCADE"),nullable=False)
    user_id = Column(Integer,ForeignKey("users.id", ondelete="CASCADE"),nullable=False)
    content = Column(String(2000), nullable=False)
    created_at = Column(DateTime,nullable=False, default=lambda: datetime.now(UTC))

    channel = relationship("Channel", back_populates="messages")
    user = relationship("User", back_populates="messages")