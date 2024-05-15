from fastapi import Depends, Request
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.websockets import WebSocket

from src.core import get_db, ValidationException, NotFoundException, TokenNotInCookieException
from src.models import UserModel
from src.schemas import TokenPayload

from src.repository import UserRepository
from src.service import JWTService
from src.config import config

jwt_service = JWTService()

def get_token_http(request: Request) -> str:
    token = request.cookies.get(config.AUTH_TOKEN_NAME)
    if not token:
        raise TokenNotInCookieException("No authentication token provided")

    return token

async def get_user_from_token_http(token: str = Depends(get_token_http), db: AsyncSession = Depends(get_db)) -> UserModel:
    try:
        token_payload: TokenPayload = jwt_service.verify_token(token)
    except(jwt.JWTError, ValidationError):
        raise ValidationException("Could not validate credentials")

    user_repository = UserRepository(session=db)
    user = await user_repository.get_user_by_email(token_payload.email)

    if user is None:
        raise NotFoundException(f"Could not find user with token {token}")

    return user

async def get_user_from_token_ws(websocket: WebSocket, db: AsyncSession = Depends(get_db)) -> UserModel:
    token = websocket.cookies.get(config.AUTH_TOKEN_NAME)
    if not token:
        await websocket.close(code=1008, reason="Authentication token not provided")
        raise TokenNotInCookieException("No authentication token provided")

    try:
        token_payload: TokenPayload = jwt_service.verify_token(token)
    except (jwt.JWTError, ValidationError) as e:
        await websocket.close(code=1008, reason="Invalid token")
        raise ValidationException("Could not validate credentials")

    user_repository = UserRepository(session=db)
    user = await user_repository.get_user_by_email(token_payload.email)

    if user is None:
        await websocket.close(code=1008, reason="User not found")
        raise NotFoundException(f"Could not find user with token {token}")

    return user