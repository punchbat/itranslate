from datetime import datetime, timedelta
from typing import Optional
from src.config import config


class TokenPayload():
    id: str
    email: str
    name: str
    surname: str
    exp: int

    def __init__(self, id: str, email: str, name: str, surname: str, exp: int = None):
        self.id: str = id
        self.email: str = email
        self.name: str = name
        self.surname: str = surname
        self.exp: int = exp or (datetime.now() + timedelta(minutes=config.AUTH_TOKEN_TTL)).timestamp()

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "surname": self.surname,
            "exp": self.exp
        }

    @staticmethod
    def from_dict(data: dict):
        return TokenPayload(
            id=data.get("id"),
            email=data.get("email"),
            name=data.get("name"),
            surname=data.get("surname"),
            exp=data.get("exp")
        )