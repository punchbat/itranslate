from fastapi import Depends

from src.core import verify_password, get_password_hash, ConflictException, IncorrectSignInException, NotFoundException
from src.models import UserModel
from src.repository.user_repository import UserRepository
from src.schemas.token import TokenPayload
from src.schemas.user import SignUpRequest, UpdateProfileRequest, UserResponse, SignInRequest
from .jwt_service import JWTService

jwt_service = JWTService()


class UserService:
    def __init__(self, user_repository: UserRepository = Depends(UserRepository)):
        self.user_repository = user_repository

    async def sign_up(self, request_data: SignUpRequest) -> str:
        existing_user = await self.user_repository.get_user_by_email(request_data.email)
        if existing_user:
            raise ConflictException(f"Email {existing_user.email} already registered")

        hashed_password = get_password_hash(request_data.password.get_secret_value())
        user = await self.user_repository.create(
            email=request_data.email,
            hashed_password=hashed_password,
            name=request_data.name,
            surname=request_data.surname
        )
        token_payload = TokenPayload(
            id=str(user.id),
            email=user.email,
            name=user.name,
            surname=user.surname
        )
        access_token = jwt_service.create_access_token(token_payload=token_payload)
        return access_token

    async def sign_in(self, request_data: SignInRequest) -> str:
        user = await self.user_repository.get_user_by_email(request_data.email)
        if not user or not verify_password(request_data.password.get_secret_value(), user.hashed_password):
            raise IncorrectSignInException("Incorrect email or password")

        token_payload = TokenPayload(
            id=str(user.id),
            email=user.email,
            name=user.name,
            surname=user.surname,
        )
        access_token = jwt_service.create_access_token(token_payload=token_payload)
        return access_token

    async def get_profile(self, user: UserModel) -> UserResponse:
        return UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            surname=user.surname,
            createdAt=user.created_at,
            updatedAt=user.updated_at
        )

    async def update_user(self, user: UserModel, request_data: UpdateProfileRequest) -> UserResponse:
        user = await self.user_repository.update(user, **request_data.dict(exclude_unset=True))
        if not user:
            raise NotFoundException(f"User not found")

        return UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            surname=user.surname,
            cretedAt=user.created_at,
            updatedAt=user.updated_at
        )
