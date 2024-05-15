import enum

from sqlalchemy import Column, VARCHAR, TEXT, Enum

from .base_model import BaseDBModel


class ImageStatus(enum.Enum):
    UNPROCESSED = "unprocessed"
    PROCESSING = "processing"
    TRANSLATED = "translated"
    ERROR = "error"


class ImageModel(BaseDBModel):
    __tablename__: str = "images"

    path = Column(VARCHAR(255), nullable=False)
    name = Column(VARCHAR(255), nullable=False)
    description = Column(TEXT, nullable=True)
    source_language = Column(VARCHAR(3), nullable=False)
    target_language = Column(VARCHAR(3), nullable=False)
    status = Column(Enum(ImageStatus), default=ImageStatus.UNPROCESSED, nullable=False)
