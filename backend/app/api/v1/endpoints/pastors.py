
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_database, require_role
from app.models.user import UserRole
from app.schemas.pastor import PastorListResponse, PastorProfileResponse, PastorProfileUpdate
from app.schemas.user import CurrentUser
from app.services.pastor_service import PastorService

router = APIRouter()


def get_pastor_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> PastorService:
    return PastorService(db.users)


def _to_response(doc: dict) -> PastorProfileResponse:
    profile = doc.get("profile", {})
    return PastorProfileResponse(
        id=str(doc["_id"]),
        email=doc["email"],
        first_name=doc["first_name"],
        last_name=doc["last_name"],
        bio=profile.get("bio", ""),
        church_name=profile.get("church_name", ""),
        denomination=profile.get("denomination", ""),
        location=profile.get("location", ""),
        photo_url=profile.get("photo_url"),
        specialties=profile.get("specialties", []),
        is_visible=profile.get("is_visible", True),
    )


@router.get("", response_model=PastorListResponse)
async def list_pastors(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    service: PastorService = Depends(get_pastor_service),
):
    pastors, total = await service.get_public_pastors(skip, limit)
    return PastorListResponse(
        pastors=[_to_response(p) for p in pastors],
        total=total,
    )


@router.get("/me", response_model=PastorProfileResponse)
async def get_my_profile(
    current_user: CurrentUser = Depends(require_role(UserRole.pastor)),
    service: PastorService = Depends(get_pastor_service),
):
    if not current_user.user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not registered")
    doc = await service.get_by_id(current_user.user_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return _to_response(doc)


@router.put("/me", response_model=PastorProfileResponse)
async def update_my_profile(
    data: PastorProfileUpdate,
    current_user: CurrentUser = Depends(require_role(UserRole.pastor)),
    service: PastorService = Depends(get_pastor_service),
):
    if not current_user.user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not registered")
    doc = await service.update_profile(current_user.user_id, data.model_dump(exclude_unset=True))
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return _to_response(doc)


@router.get("/{pastor_id}", response_model=PastorProfileResponse)
async def get_pastor(
    pastor_id: str,
    service: PastorService = Depends(get_pastor_service),
):
    doc = await service.get_public_pastor(pastor_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pastor not found")
    return _to_response(doc)
