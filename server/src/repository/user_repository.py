from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.models import UserModel
from src.repository.base_repository import BaseRepository
from src.core import get_db

class UserRepository(BaseRepository[UserModel]):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(UserModel, session)

    async def get_user_by_email(self, email: str) -> UserModel | None:
        result = await self.db.execute(select(UserModel).where(UserModel.email == email))
        return result.scalars().first()