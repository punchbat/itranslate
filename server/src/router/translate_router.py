from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from starlette import status

from src.core import ValidationException
from src.dependecy import get_user_from_token_http
from src.models import UserModel
from src.schemas import ApiResponse
from src.service import TranslateService

router = APIRouter(
    prefix="/translate/v1"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.get("/translate", response_model=ApiResponse)
async def translate_image(
        image: UploadFile = File(...),
        target_language: str = Form(...),
        _: UserModel = Depends(get_user_from_token_http),
        translate_service: TranslateService = Depends()
    ):
    if not image.content_type.startswith('image/'):
        raise ValidationException("Invalid file type")

    image_data = await image.read()
    translated_image = await translate_service.translate_image(image_data, target_language)
    return ApiResponse(
        status=status.HTTP_200_OK,
        payload={"image": translated_image}
    )
