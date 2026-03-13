from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_database
from app.config import settings
from app.schemas.waitlist import WaitlistRequest, WaitlistResponse, WaitlistStatsResponse
from app.services.waitlist_service import WaitlistService

router = APIRouter()
security = HTTPBasic()


def get_waitlist_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> WaitlistService:
    return WaitlistService(db.waitlist)


def _to_response(doc: dict) -> WaitlistResponse:
    created = doc["created_at"]
    return WaitlistResponse(
        id=str(doc["_id"]),
        email=doc["email"],
        source=doc.get("source", "unknown"),
        ip_address=doc.get("ip_address"),
        user_agent=doc.get("user_agent"),
        city=doc.get("city"),
        region=doc.get("region"),
        country=doc.get("country"),
        created_at=(
            created.isoformat()
            if hasattr(created, "isoformat")
            else str(created)
        ),
    )


def verify_admin(
    credentials: HTTPBasicCredentials = Depends(security),
) -> str:
    if (
        credentials.username != settings.admin_username
        or credentials.password != settings.admin_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


@router.post("", response_model=WaitlistResponse, status_code=201)
async def join_waitlist(
    data: WaitlistRequest,
    request: Request,
    service: WaitlistService = Depends(get_waitlist_service),
):
    ip = request.headers.get(
        "x-forwarded-for", request.client.host if request.client else None
    )
    user_agent = request.headers.get("user-agent")

    doc = await service.add_to_waitlist({
        "email": data.email,
        "source": data.source,
        "ip_address": ip,
        "user_agent": user_agent,
    })
    return _to_response(doc)


@router.get("", response_model=WaitlistStatsResponse)
async def list_waitlist(
    _admin: str = Depends(verify_admin),
    service: WaitlistService = Depends(get_waitlist_service),
):
    entries = await service.get_all_entries()
    stats = await service.get_stats()
    return WaitlistStatsResponse(
        total=stats["total"],
        by_source=stats["by_source"],
        entries=[_to_response(e) for e in entries],
    )
