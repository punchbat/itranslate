class BaseApplicationException(Exception):
    """
    Base class for any exception raised from the application.
    """

class AccessTokenMalformedException(BaseApplicationException):
    """
    Raised when an access token is malformed.
    """

class ConflictException(BaseApplicationException):
    """
    Base class for any exception raised from a service.
    """

class NotFoundException(BaseApplicationException):
    """
    Raised when a model is not found in the database.
    """

class UnauthorizedException(BaseApplicationException):
    """
    Raised when a model is not found in the database.
    """

class IncorrectSignInException(BaseApplicationException):
    """
    Raised when a model is not found in the database.
    """

class TokenExpiredException(BaseApplicationException):
    """
    Raised when a model is not found in the database.
    """

class ValidationException(BaseApplicationException):
    """
    Raised when input data is not valid.
    """

class VerifyTokenException(BaseApplicationException):
    """
    Raised when input data is not valid.
    """

class DecodeTokenException(BaseApplicationException):
    """
    Raised when input data is not valid.
    """

class TokenNotInCookieException(BaseApplicationException):
    """
    Raised when input data is not valid.
    """
