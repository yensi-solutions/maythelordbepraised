from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user, get_database, require_role
from app.models.user import UserRole
from app.schemas.prayer import (
    CreatePrayerRequest,
    MarkAnsweredRequest,
    PrayerRespondRequest,
    PrayerResponse,
)
from app.schemas.user import CurrentUser
from app.services.prayer_service import PrayerService

router = APIRouter()


def get_prayer_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> PrayerService:
    return PrayerService(db.prayers)


def _prayer_response(p: dict) -> PrayerResponse:
    return PrayerResponse(
        id=str(p["_id"]),
        author_id=str(p["author_id"]) if p.get("author_id") else None,
        is_anonymous=p["is_anonymous"],
        text=p["text"],
        status=p["status"],
        pray_count=p["pray_count"],
        testimony=p.get("testimony"),
        pastor_responses=[
            {"pastor_id": r.get("pastor_id", ""), "text": r["text"]}
            for r in p.get("pastor_responses", [])
        ],
    )


@router.post("", response_model=PrayerResponse, status_code=status.HTTP_201_CREATED)
async def create_prayer(
    data: CreatePrayerRequest,
    user: CurrentUser = Depends(get_current_user),
    service: PrayerService = Depends(get_prayer_service),
):
    prayer = await service.create_prayer(user.user_id, data.model_dump())
    return _prayer_response(prayer)


@router.get("", response_model=list[PrayerResponse])
async def list_prayers(
    status_filter: str | None = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    service: PrayerService = Depends(get_prayer_service),
):
    prayers = await service.get_prayers(status=status_filter, skip=skip, limit=limit)
    return [_prayer_response(p) for p in prayers]


@router.post("/{prayer_id}/pray", response_model=PrayerResponse)
async def pray_for(
    prayer_id: str,
    service: PrayerService = Depends(get_prayer_service),
):
    prayer = await service.increment_pray_count(prayer_id)
    if not prayer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prayer not found")
    return _prayer_response(prayer)


@router.post("/{prayer_id}/respond", response_model=PrayerResponse)
async def respond_to_prayer(
    prayer_id: str,
    data: PrayerRespondRequest,
    user: CurrentUser = Depends(require_role(UserRole.pastor)),
    service: PrayerService = Depends(get_prayer_service),
):
    prayer = await service.add_pastor_response(prayer_id, user.user_id, data.text)
    if not prayer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prayer not found")
    return _prayer_response(prayer)


@router.post("/{prayer_id}/answered", response_model=PrayerResponse)
async def mark_prayer_answered(
    prayer_id: str,
    data: MarkAnsweredRequest,
    user: CurrentUser = Depends(get_current_user),
    service: PrayerService = Depends(get_prayer_service),
):
    prayer = await service.mark_answered(prayer_id, data.testimony)
    if not prayer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prayer not found")
    return _prayer_response(prayer)
