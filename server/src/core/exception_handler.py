from typing import Type

from fastapi import FastAPI, Response, status
from pydantic import ValidationError
from starlette.responses import JSONResponse
from starlette.websockets import WebSocket, WebSocketState

from src.core import BaseApplicationException, NotFoundException, ConflictException, UnauthorizedException, IncorrectSignInException, TokenExpiredException, ValidationException

exceptions_to_status_codes: dict[Type[BaseApplicationException], int] = {
    NotFoundException: status.HTTP_404_NOT_FOUND,
    ConflictException: status.HTTP_409_CONFLICT,
    UnauthorizedException: status.HTTP_401_UNAUTHORIZED,
    IncorrectSignInException: status.HTTP_406_NOT_ACCEPTABLE,
    TokenExpiredException: status.HTTP_401_UNAUTHORIZED,
    ValidationException: status.HTTP_403_FORBIDDEN,
    ValidationError: status.HTTP_422_UNPROCESSABLE_ENTITY
}

def add_application_exception_handler(
        application: FastAPI,
        exceptions_to_http_status_codes: dict[Type[BaseApplicationException], int],
) -> None:
    @application.exception_handler(BaseApplicationException)
    async def application_exception_handler(_, exception: BaseApplicationException) -> Response:
        status_code = exceptions_to_http_status_codes.get(type(exception), status.HTTP_500_INTERNAL_SERVER_ERROR)
        return JSONResponse(
            status_code=status_code,
            content={
                "status": status_code,
                "message": str(exception),
            }
        )

    @application.exception_handler(ValidationError)
    async def validation_exception_handler(_, exception: ValidationError) -> Response:
        status_code = exceptions_to_http_status_codes.get(type(exception), status.HTTP_500_INTERNAL_SERVER_ERROR)
        return JSONResponse(
            status_code=status_code,
            content={
                "status": status_code,
                "message": str(exception),
            }
        )

async def websocket_exception_handler(websocket: WebSocket, exception: BaseApplicationException) -> None:
    if websocket.application_state != WebSocketState.DISCONNECTED:
        await websocket.send_json({
            "error": str(exception),
            "code": exceptions_to_status_codes.get(type(exception), 500)
        })
        await websocket.close(code=status.HTTP_400_BAD_REQUEST)