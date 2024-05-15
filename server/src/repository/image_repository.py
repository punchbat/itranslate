from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import ImageModel
from src.repository.base_repository import BaseRepository
from src.core import get_db

class ImageRepository(BaseRepository[ImageModel]):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(ImageModel, session)