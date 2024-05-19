from typing import Optional

from .base import BaseAPIModel


class TranslateTextRequest(BaseAPIModel):
    sourceLanguage: Optional[str] = None
    sourceText: str
    targetLanguage: str


class TranslateImageRequest(BaseAPIModel):
    imageData: bytes
    sourceLanguage: Optional[str] = None
    targetLanguage: str
