from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm.session import sessionmaker

from src.config import config

engine = create_async_engine(
    config.get_db_uri(),
    echo=True,
)

SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def get_db():
    async with SessionLocal() as session:
        yield session

@asynccontextmanager
async def get_db_asynccontextmanager():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()