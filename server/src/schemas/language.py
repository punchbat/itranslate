from src.schemas.base import BaseAPIModel


class DetectLanguageRequest(BaseAPIModel):
    text: str

class DetectLanguageResponse(BaseAPIModel):
    code: str
    name: str
