from sqlalchemy.orm import Session
from fastapi import HTTPException
from repository.workspace_repository import WorkspaceRepository
from repository.channel_repository import ChannelRepository
from repository.DMConversation_repository import DMConversationRepository
from repository.user_repository import UserRepository

class SearchService:
    @staticmethod
    def search_globally(content: str, user_id: int, db: Session):

        workspaces = WorkspaceRepository.search_workspaces(content, user_id, db)

        channels = ChannelRepository.search_channels(content, user_id, db)

        conversations = DMConversationRepository.search_conversations(content, user_id, db)

        users = UserRepository.get_by_username(content, db)
