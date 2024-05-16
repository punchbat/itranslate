from datetime import datetime
from typing import Optional

from .base import BaseAPIModel


class TranslateImageRequest(BaseAPIModel):
    name: str
    description: Optional[str] = None
    target_language: str


class SensorResponse(BaseAPIModel):
    id: str
    sgid: str
    name: str
    description: str
    latitude: float
    longitude: float
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
