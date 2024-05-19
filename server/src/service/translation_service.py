import logging
from typing import Dict, Optional

from fastapi import Depends
from sqlalchemy.exc import SQLAlchemyError

from src.core import ConflictException
from src.repository import TranslationRepository
from src.schemas import TranslationResponse

logger = logging.getLogger(__name__)


class TranslationService:
    def __init__(
            self,
            translation_repository: TranslationRepository = Depends(TranslationRepository)
    ):
        self.translation_repository = translation_repository

    async def get_translation(self, id: str) -> TranslationResponse:
        entity = await self.translation_repository.get_by_id(id)

        return TranslationResponse(
            id=str(entity.id),
            status=entity.status,
            type=entity.type,
            path=entity.path,
            sourceLanguage=entity.source_language,
            sourceText=entity.source_text,
            targetLanguage=entity.target_language,
            translatedText=entity.translated_text,
            createdAt=entity.created_at,
            updatedAt=entity.updated_at,
        )

    async def get_list_translation_by_filters(self, filters: Dict[str, Optional[str]]) -> list[TranslationResponse]:
        try:
            entities = await self.translation_repository.get_list_translation_by_filter(filters)
            return [TranslationResponse(
                id=str(entity.id),
                status=entity.status,
                type=entity.type,
                path=entity.path,
                sourceLanguage=entity.source_language,
                sourceText=entity.source_text,
                targetLanguage=entity.target_language,
                translatedText=entity.translated_text,
                createdAt=entity.created_at,
                updatedAt=entity.updated_at,
            ) for entity in entities]
        except SQLAlchemyError as e:
            logger.error(f"Failed to query translations: {e}")
            raise ConflictException(f"Database error: {str(e)}")
