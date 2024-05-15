from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

from starlette import status

from src.dependecy import get_user_from_token_http
from src.models import UserModel
from src.schemas import ApiResponse, UpdateProfileRequest
from src.service import UserService

router = APIRouter(
    prefix="/profile/v1"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.get("/get-my-profile", response_model=ApiResponse)
async def get_profile(user: UserModel = Depends(get_user_from_token_http), user_service: UserService = Depends()):
    user_profile = await user_service.get_profile(user)
    return ApiResponse(
        status=status.HTTP_200_OK,
        payload=user_profile
    )

@router.post("/update-profile", response_model=ApiResponse)
async def update_profile(update_profile_request: UpdateProfileRequest, user: UserModel = Depends(get_user_from_token_http), user_service: UserService = Depends()):
    user_profile = await user_service.update_user(user, update_profile_request)
    return ApiResponse(
        status=status.HTTP_200_OK,
        payload=user_profile
    )