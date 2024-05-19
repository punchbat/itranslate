from typing import Dict, Optional

from fastapi import Depends
from sqlalchemy import select, or_, cast, String
from sqlalchemy.ext.asyncio import AsyncSession

from src.core import get_db
from src.models import TranslationModel
from src.repository.base_repository import BaseRepository


class TranslationRepository(BaseRepository[TranslationModel]):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(TranslationModel, session)

    async def get_list_translation_by_filter(self, filters: Dict[str, Optional[str]]) -> list[TranslationModel]:
        query = select(self.model)

        if 'search' in filters and filters['search']:
            search_pattern = f"%{filters['search']}%"

            sub_query = select(TranslationModel.id).where(
                or_(
                    TranslationModel.id.ilike(search_pattern),
                    TranslationModel.source_text.ilike(search_pattern),
                    TranslationModel.translated_text.ilike(search_pattern),
                    cast(TranslationModel.id, String).ilike(search_pattern)
                )
            )

            sub_result = await self.db.execute(sub_query)
            sensor_ids = sub_result.scalars().all()

            if sensor_ids:
                query = query.where(self.model.sensor_id.in_(sensor_ids))
            else:
                return []

        if 'createdAtFrom' in filters and filters['createdAtFrom']:
            query = query.where(self.model.created_at >= filters['createdAtFrom'])
        if 'createdAtTo' in filters and filters['createdAtTo']:
            query = query.where(self.model.created_at <= filters['createdAtTo'])
        if 'updatedAtFrom' in filters and filters['updatedAtFrom']:
            query = query.where(self.model.created_at >= filters['updatedAtFrom'])
        if 'updatedAtTo' in filters and filters['updatedAtTo']:
            query = query.where(self.model.created_at <= filters['updatedAtTo'])

        result = await self.db.execute(query)

        return result.scalars().all()
