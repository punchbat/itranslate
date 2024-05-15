from fastapi import APIRouter, Depends, Response,Request
from fastapi.security import OAuth2PasswordBearer

from starlette import status

from src.dependecy import get_token_http
from src.schemas import SignUpRequest, SignInRequest
from src.service import UserService
from src.config import config

router = APIRouter(
    prefix="/auth/v1"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/sign-up")
async def sign_up(user_data: SignUpRequest, user_service: UserService = Depends()):
    access_token = await user_service.sign_up(user_data)

    response = Response(status_code=status.HTTP_200_OK)
    response.set_cookie(
        key=config.AUTH_TOKEN_NAME,
        value=access_token,
        httponly=config.AUTH_TOKEN_HTTP_ONLY,
        max_age=config.AUTH_TOKEN_TTL,
        path=config.AUTH_TOKEN_PATH,
        domain=config.AUTH_TOKEN_DOMAIN,
        secure=config.AUTH_TOKEN_SECURE
    )
    return response

@router.post("/sign-in")
async def sign_in(user_data: SignInRequest, user_service: UserService = Depends()):
    access_token = await user_service.sign_in(user_data)

    response = Response(status_code=status.HTTP_200_OK)
    response.set_cookie(
        key=config.AUTH_TOKEN_NAME,
        value=access_token,
        httponly=config.AUTH_TOKEN_HTTP_ONLY,
        max_age=config.AUTH_TOKEN_TTL,
        path=config.AUTH_TOKEN_PATH,
        domain=config.AUTH_TOKEN_DOMAIN,
        secure=config.AUTH_TOKEN_SECURE
    )
    return response

@router.post("/logout")
async def logout():
    response = Response(status_code=status.HTTP_200_OK)
    response.delete_cookie(
        key=config.AUTH_TOKEN_NAME,
        path=config.AUTH_TOKEN_PATH,
        domain=config.AUTH_TOKEN_DOMAIN
    )
    return response