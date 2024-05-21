from fastapi import APIRouter, Depends, Query
from starlette import status

from src.core import ValidationException
from src.dependecy import get_user_from_token_http
from src.models import UserModel
from src.schemas import ApiResponse, DetectLanguageRequest
from src.service import LanguageService

router = APIRouter(
    prefix="/language/v1"
)


@router.get("/list", response_model=ApiResponse)
async def translate_image(
        _: UserModel = Depends(get_user_from_token_http),
        language_service: LanguageService = Depends()
):
    response = language_service.get_languages()
    return ApiResponse(
        status=status.HTTP_200_OK,
        payload=response
    )


@router.post("/suggest", response_model=ApiResponse)
async def translate_image(
        detect_language_request: DetectLanguageRequest,
        _: UserModel = Depends(get_user_from_token_http),
        language_service: LanguageService = Depends()
):
    if len(detect_language_request.text) == 0:
        raise ValidationException("Text must not be empty")

    response = await language_service.detect_language(detect_language_request.text)
    return ApiResponse(
        status=status.HTTP_200_OK,
        payload=response
    )
