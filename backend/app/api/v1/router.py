from fastapi import APIRouter

from app.api.v1.endpoints import auth, booking, giving, health, pastors, prayers

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(pastors.router, prefix="/pastors", tags=["pastors"])
api_router.include_router(booking.router, prefix="/booking", tags=["booking"])
api_router.include_router(prayers.router, prefix="/prayers", tags=["prayers"])
api_router.include_router(giving.router, prefix="/donations", tags=["donations"])
