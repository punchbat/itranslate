from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form
from starlette import status

from src.core import ValidationException
from src.dependecy import get_user_from_token_http
from src.models import UserModel
from src.schemas import ApiResponse, TranslateImageRequest, TranslateTextRequest
from src.service import TranslateService

router = APIRouter(
    prefix="/translate/v1"
)


@router.post("/text", response_model=ApiResponse)
async def translate_image(
        translate_request: TranslateTextRequest,
        _: UserModel = Depends(get_user_from_token_http),
        translate_service: TranslateService = Depends()
):
    if len(translate_request.sourceText) == 0:
        raise ValidationException("Text must not be empty")

    response = await translate_service.translate_text(translate_request)
    return ApiResponse(
        status=status.HTTP_200_OK,
        payload=response
    )


@router.post("/image", response_model=ApiResponse)
async def translate_image(
        image: UploadFile = File(...),
        targetLanguage: str = Form(...),
        _: UserModel = Depends(get_user_from_token_http),
        translate_service: TranslateService = Depends()
):
    if not image.content_type.startswith('image/'):
        raise ValidationException("Invalid file type")

    image_data = await image.read()
    translate_request = TranslateImageRequest(
        imageData=image_data,
        targetLanguage=targetLanguage
    )

    response = await translate_service.translate_image(translate_request)
    return ApiResponse(
        status=status.HTTP_200_OK,
        payload=response
    )
