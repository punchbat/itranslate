from typing import TypeVar, Generic, Type, List

from fastapi import Depends
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.core import get_db
from src.models import BaseDBModel

DBModelType = TypeVar("DBModelType", bound=BaseDBModel)

class BaseRepository(Generic[DBModelType]):
    def __init__(self, model: Type[DBModelType], session: AsyncSession = Depends(get_db)):
        self.db = session
        self.model = model

    async def get(self, id: str) -> DBModelType | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()

    async def create(self, **kwargs) -> DBModelType:
        entity = self.model(**kwargs)
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def create_batch(self, data_list: List[dict]) -> List[DBModelType]:
        entities = [self.model(**data) for data in data_list]
        self.db.add_all(entities)
        try:
            await self.db.commit()
            for entity in entities:
                await self.db.refresh(entity)
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise
        return entities

    async def update(self, entity: DBModelType, **kwargs) -> DBModelType:
        for key, value in kwargs.items():
            setattr(entity, key, value)
        self.db.merge(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def delete(self, entity: DBModelType) -> None:
        await self.db.delete(entity)
        await self.db.commit()

    async def get_list(self) -> List[DBModelType]:
        result = await self.db.execute(select(self.model))
        return result.scalars().all()