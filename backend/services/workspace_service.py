from sqlalchemy.orm import Session
from fastapi import HTTPException
from repository.workspace_repository import WorkspaceRepository
from services.auth_service import AuthService
from models import WorkspaceMember
    
class WorkspaceService:

    @staticmethod
    def create_workspace(name: str, user_id: int, db: Session
    ):
        workspace = WorkspaceRepository.create_workspace(name, user_id, db)

        try:
            db.commit()
            db.refresh(workspace)
        except Exception:
            db.rollback()
            raise

        return workspace

    @staticmethod
    def get_user_workspaces(user_id: int, db: Session):

        return WorkspaceRepository.get_user_workspaces(user_id, db)

    @staticmethod
    def update_workspace(workspace_id: int, user_id: int, name: str, db: Session):

        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace not found")
        
        owner = WorkspaceRepository.get_workspace_owner(workspace_id, user_id, db)

        if owner is None:
            raise HTTPException(status_code=403, detail="Only the workspace owner can update the workspace")
        
        workspace.name = name

        try:
            db.commit()
            db.refresh(workspace)
        except Exception:
            db.rollback()
            raise

        return workspace

    @staticmethod
    def delete_workspace(workspace_id: int, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace not found")

        owner = WorkspaceRepository.get_workspace_owner(workspace_id, user_id, db)

        if owner is None:
            raise HTTPException(status_code=403, detail="Only the workspace owner can delete the workspace")

        

        try:
            db.delete(workspace)
            db.commit()
        except Exception:
            db.rollback()

        return {"Message": "Workspace Deleted"}

    @staticmethod
    def add_member_to_workspace(workspace_id: int, added_user_id: int, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace not found")

        owner = WorkspaceRepository.get_workspace_owner(workspace_id, user_id, db)

        if owner is None:
            raise HTTPException(status_code=403, detail="Only the workspace owner can add a member")

        AuthService.find_user_by_id(added_user_id, db) #checks if the user exist

        add_user = WorkspaceRepository.user_already_member(workspace_id, added_user_id, db)

        if add_user:
            raise HTTPException(status_code=409, detail="User Already in Workspace")

        member = WorkspaceMember(user_id=added_user_id, workspace_id=workspace_id, role='member')

        db.add(member)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        return {"Message": "User Successfully Added"}

    @staticmethod
    def get_workspace_members(workspace_id: int, user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace not found")

        owner = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if owner is None:
            raise HTTPException(status_code=403, detail="Only A Member of the workspace can get the list of members")

        return WorkspaceRepository.get_workspace_members(workspace_id, db)

    @staticmethod
    def delete_workspace_member(workspace_id: int, user_id: int, current_user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace not found")

        owner = WorkspaceRepository.get_workspace_owner(workspace_id, current_user_id, db)

        if owner is None:
            raise HTTPException(status_code=403, detail="Only the workspace owner can delete a member")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=404, detail="User is not a member of workspace")

        is_owner = WorkspaceRepository.is_workspace_owner(workspace_id, user_id, db)

        if is_owner:
            raise HTTPException(status_code=403, detail="Owner cannot delete himself from the workspace")

        db.delete(member)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        return {"message": "Member Successfully Deleted"}

    @staticmethod
    def update_workspace_member_role(workspace_id: int, user_id: int, role: str, current_user_id: int, db: Session):
        workspace = WorkspaceRepository.get_workspace(workspace_id, db)

        if workspace is None:
            raise HTTPException(status_code=404, detail="Workspace not found")

        owner = WorkspaceRepository.get_workspace_owner(workspace_id, current_user_id, db)

        if owner is None:
            raise HTTPException(status_code=403, detail="Only the workspace owner can change a member's role")

        member = WorkspaceRepository.get_workspace_member(workspace_id, user_id, db)

        if member is None:
            raise HTTPException(status_code=404, detail="User is not a member of workspace")

        is_owner = WorkspaceRepository.is_workspace_owner(workspace_id, user_id, db)

        if is_owner:
            raise HTTPException(status_code=403, detail="Owner cannot change his own role")

        member.role = role

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

        return {"message": "Member role updated"}



        

        



        
