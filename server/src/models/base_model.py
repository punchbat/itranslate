from sqlalchemy import Column, func, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped

Base = declarative_base()

class BaseDBModel(Base):
    __abstract__ = True

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    created_at: Mapped[DateTime] = Column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[DateTime] = Column(DateTime, nullable=True, onupdate=func.now())