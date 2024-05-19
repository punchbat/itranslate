from datetime import datetime
from enum import Enum
from typing import Optional

from .base import BaseAPIModel


class TranslationStatus(Enum):
    UNPROCESSED = "unprocessed"
    PROCESSING = "processing"
    TRANSLATED = "translated"
    ERROR = "error"


class TranslationType(Enum):
    TEXT = "text"
    IMAGE = "image"


class TranslationResponse(BaseAPIModel):
    id: str
    status: TranslationStatus
    type: TranslationType
    path: Optional[str] = None
    sourceLanguage: str
    sourceText: str
    targetLanguage: str
    translatedText: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
