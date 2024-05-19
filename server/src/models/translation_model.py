import enum

from sqlalchemy import Column, VARCHAR, TEXT, Enum

from .base_model import BaseDBModel


class TranslationStatus(enum.Enum):
    UNPROCESSED = "unprocessed"
    PROCESSING = "processing"
    TRANSLATED = "translated"
    ERROR = "error"


class TranslationType(enum.Enum):
    TEXT = "text"
    IMAGE = "image"


class TranslationModel(BaseDBModel):
    __tablename__: str = "translations"

    status = Column(Enum(TranslationStatus), default=TranslationStatus.UNPROCESSED, nullable=False)
    type = Column(Enum(TranslationType), default=TranslationType.TEXT, nullable=False)

    path = Column(VARCHAR(255))

    source_language = Column(VARCHAR(3), nullable=False)
    source_text = Column(TEXT, nullable=False)

    target_language = Column(VARCHAR(3), nullable=False)
    translated_text = Column(TEXT)
