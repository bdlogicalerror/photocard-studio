from fastapi import APIRouter
from api.v1.endpoints import generate, verify, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(generate.router, prefix="/generate", tags=["generation"])
api_router.include_router(verify.router, prefix="/verify", tags=["verification"])
