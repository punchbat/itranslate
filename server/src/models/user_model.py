from sqlalchemy import Column, String,VARCHAR

from .base_model import BaseDBModel

class UserModel(BaseDBModel):
    __tablename__: str = "users"

    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    name = Column(String, nullable=True)
    surname = Column(String, nullable=True)