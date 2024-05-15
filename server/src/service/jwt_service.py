from datetime import datetime, timedelta

from jose import jwt, JWTError

from src.config import config
from src.core import DecodeTokenException, TokenExpiredException
from src.schemas import TokenPayload


class JWTService:
    def __init__(self, secret_key: str = config.AUTH_SECRET_KEY,
                 algorithm: str = config.AUTH_ALGORITHM,
                 token_ttl: int = config.AUTH_TOKEN_TTL):
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.token_ttl = token_ttl

    def create_access_token(self, token_payload: TokenPayload, expires_delta: timedelta = None) -> str:
        to_encode = token_payload.to_dict()
        if expires_delta is None:
            expires_delta = timedelta(minutes=self.token_ttl)
        expire = datetime.now() + expires_delta
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def verify_token(self, token: str) -> TokenPayload:
        token_payload = self.decode_token(token)
        if datetime.fromtimestamp(token_payload.exp) < datetime.now():
            raise TokenExpiredException("Token has expired")
        return token_payload

    def decode_token(self, token: str) -> TokenPayload:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return TokenPayload.from_dict(payload)
        except JWTError:
            raise DecodeTokenException("Could not decode token")
