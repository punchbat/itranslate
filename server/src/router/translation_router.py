from typing import Optional

from fastapi import APIRouter, Depends, Query
from starlette import status

from src.core import NotFoundException
from src.dependecy import get_user_from_token_http
from src.models import UserModel
from src.schemas import ApiResponse
from src.service import TranslationService

router = APIRouter(
    prefix="/translation/v1"
)


@router.get("/translation/{id}", response_model=ApiResponse)
async def translate_image(
        id: str,
        _: UserModel = Depends(get_user_from_token_http),
        translation_service: TranslationService = Depends()
):
    try:
        translation_response = await translation_service.get_translation(id)
        return ApiResponse(
            status=status.HTTP_200_OK,
            payload=translation_response
        )
    except Exception as e:
        raise NotFoundException(f"Could not find translation data by id: {id}")


@router.get("/list", response_model=ApiResponse)
async def get_list_translation_by_filters(
        search: Optional[str] = Query(None),
        createdAtFrom: Optional[str] = Query(None),
        createdAtTo: Optional[str] = Query(None),
        updatedAtFrom: Optional[str] = Query(None),
        updatedAtTo: Optional[str] = Query(None),
        _: UserModel = Depends(get_user_from_token_http),
        translation_service: TranslationService = Depends()
):
    filters = {
        "search": search,
        "created_at_from": createdAtFrom,
        "created_at_to": createdAtTo,
        "updated_at_from": updatedAtFrom,
        "updated_at_to": updatedAtTo
    }
    filters = {k: v for k, v in filters.items() if v is not None}

    try:
        translation_response = await translation_service.get_list_translation_by_filters(filters)
        return ApiResponse(
            status=status.HTTP_200_OK,
            payload=translation_response
        )
    except Exception as e:
        raise NotFoundException(f"Could not find translations data by filters: {filters}")
