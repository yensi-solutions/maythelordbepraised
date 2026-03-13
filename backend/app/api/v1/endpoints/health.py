from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_database

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    return {"status": "healthy"}


@router.get("/ready")
async def readiness_check(db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        await db.command("ping")
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        return {"status": "not_ready", "database": str(e)}
