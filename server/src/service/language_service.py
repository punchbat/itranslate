import logging

from fastapi import Depends
from googletrans import LANGUAGES

from src.core import TranslateManager
from src.schemas import DetectLanguageResponse

logger = logging.getLogger(__name__)


class LanguageService:
    def __init__(
            self,
            translate_manager: TranslateManager = Depends(TranslateManager),
    ):
        self.translate_manager = translate_manager

    def get_languages(self):
        return LANGUAGES

    async def detect_language(self, text: str) -> DetectLanguageResponse:
        language_code = self.translate_manager.detect_language(text)
        return DetectLanguageResponse(
            code=language_code,
            name=LANGUAGES[language_code]
        )