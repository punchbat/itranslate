from datetime import datetime
from enum import Enum
from typing import Optional

from .base import BaseAPIModel
from ..models import TranslationStatus, TranslationType


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
