from fastapi import Request, status
from fastapi.responses import JSONResponse
from utils.logging import logger

class AppException(Exception):
    """Base class for all application-specific exceptions"""
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, detail: str = None):
        self.message = message
        self.status_code = status_code
        self.detail = detail
        super().__init__(message)

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", detail: str = None):
        super().__init__(message, status.HTTP_404_NOT_FOUND, detail)

class ValidationException(AppException):
    def __init__(self, message: str = "Validation failed", detail: str = None):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY, detail)

class RateLimitException(AppException):
    def __init__(self, message: str = "Rate limit exceeded", detail: str = None):
        super().__init__(message, status.HTTP_429_TOO_MANY_REQUESTS, detail)

async def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"AppException: {exc.message} | Detail: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "detail": exc.detail},
    )

async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled Exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "An unexpected error occurred", "detail": str(exc)},
    )
