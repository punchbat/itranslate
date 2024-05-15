from datetime import datetime
from typing import Optional

from pydantic import EmailStr, Field, SecretStr

from src.schemas.base import BaseAPIModel

class SignUpRequest(BaseAPIModel):
    email: EmailStr = Field(example="john.doe@mail.com")
    password: SecretStr = Field(min_length=8, example="XZ#o2Q#eQ3y1")
    name: str = Field(min_length=2, example="John")
    surname: Optional[str] = Field(example="Jones")

class SignInRequest(BaseAPIModel):
    email: EmailStr = Field(example="john.doe@mail.com")
    password: SecretStr = Field(min_length=8, example="XZ#o2Q#eQ3y1")

class UpdateProfileRequest(BaseAPIModel):
    name: Optional[str] = Field(min_length=2, example="John")
    surname: Optional[str] = Field(min_length=2, example="Jones")

class UserResponse(BaseAPIModel):
    id: str
    email: str
    name: str
    surname: str
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
