from fastapi import APIRouter, Depends
from googletrans import LANGUAGES
from starlette import status

from src.dependecy import get_user_from_token_http
from src.models import UserModel
from src.schemas import ApiResponse

router = APIRouter(
    prefix="/language/v1"
)


@router.get("/list", response_model=ApiResponse)
async def translate_image(_: UserModel = Depends(get_user_from_token_http)):
    return ApiResponse(
        status=status.HTTP_200_OK,
        payload=LANGUAGES

    )
