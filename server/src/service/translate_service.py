import io
import logging
import uuid

from PIL import Image
from fastapi import Depends

from src.core import TranslateManager
from src.models import TranslationStatus, TranslationType
from src.repository import TranslationRepository
from src.schemas import TranslateImageRequest, TranslationResponse, TranslateTextRequest

logger = logging.getLogger(__name__)


class TranslateService:
    def __init__(
            self,
            translate_manager: TranslateManager = Depends(TranslateManager),
            translation_repository: TranslationRepository = Depends(TranslationRepository),
    ):
        self.text_manager = translate_manager
        self.translation_repository = translation_repository

    async def translate_text(self, translate_request: TranslateTextRequest) -> TranslationResponse:
        src_lang = translate_request.sourceLanguage
        if len(translate_request.sourceLanguage) == 0:
            src_lang = self.translate_manager.detect_language(translate_request.sourceText)
        print("src_lang: ", src_lang)

        translated_text = self.translate_manager.translate_text(translate_request.sourceText, src_lang,
                                                                translate_request.targetLanguage)
        print("translated text: ", translated_text)

        entityUuid = uuid.uuid4()
        await self.translation_repository.create(
            id=entityUuid,
            status=TranslationStatus.TRANSLATED,
            type=TranslationType.TEXT,
            source_language=src_lang,
            source_text=translate_request.sourceText,
            target_language=translate_request.targetLanguage,
            translated_text=translated_text,
        )

        return TranslationResponse(
            id=str(entityUuid),
            status=TranslationStatus.TRANSLATED,
            type=TranslationType.TEXT,
            sourceLanguage=src_lang,
            sourceText=translate_request.sourceText,
            targetLanguage=translate_request.targetLanguage,
            translatedText=translated_text,
        )

    async def translate_image(self, translate_request: TranslateImageRequest) -> TranslationResponse:
        text = self.translate_manager.extract_text(translate_request.imageData)
        print("extracted text: ", text)

        src_lang = translate_request.sourceLanguage
        if len(translate_request.sourceLanguage) == 0:
            src_lang = self.translate_manager.detect_language(translate_request.sourceText)
        print("src_lang: ", src_lang)

        translated_text = self.translate_manager.translate_text(text, src_lang, translate_request.targetLanguage)
        print("translated text: ", translated_text)

        final_image = self.translate_manager.overlay_text_on_image(translate_request.imageData, translated_text)

        saved_path = f"static/uploads/translated_images/{uuid.uuid4()}.png"
        image = Image.open(io.BytesIO(final_image))
        image.save(saved_path, format='PNG')

        entityUuid = uuid.uuid4()
        await self.translation_repository.create(
            id=entityUuid,
            status=TranslationStatus.TRANSLATED,
            type=TranslationType.IMAGE,
            path=saved_path,
            source_language=src_lang,
            source_text=text,
            target_language=translate_request.targetLanguage,
            translated_text=translated_text,
        )

        return TranslationResponse(
            id=str(entityUuid),
            status=TranslationStatus.TRANSLATED,
            type=TranslationType.IMAGE,
            path=saved_path,
            sourceLanguage=src_lang,
            sourceText=text,
            targetLanguage=translate_request.targetLanguage,
            translatedText=translated_text,
        )
