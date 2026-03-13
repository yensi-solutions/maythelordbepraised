from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user, get_database, require_role
from app.models.user import UserRole
from app.schemas.booking import (
    AvailabilityResponse,
    BookingResponse,
    CreateBookingRequest,
    CreateServiceRequest,
    ServiceResponse,
    SetAvailabilityRequest,
    UpdateBookingStatusRequest,
)
from app.schemas.user import CurrentUser
from app.services.booking_service import (
    AvailabilityService,
    BookingService,
    ServiceDefinitionService,
)

router = APIRouter()


def _svc_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> ServiceDefinitionService:
    return ServiceDefinitionService(db.services)


def _avail_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> AvailabilityService:
    return AvailabilityService(db.availability)


def _booking_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> BookingService:
    return BookingService(db.bookings)


def _service_response(s: dict) -> ServiceResponse:
    return ServiceResponse(
        id=str(s["_id"]),
        pastor_id=str(s["pastor_id"]),
        name=s["name"],
        description=s["description"],
        category=s["category"],
        duration_minutes=s["duration_minutes"],
        price_cents=s["price_cents"],
        mode=s["mode"],
        is_active=s["is_active"],
    )


def _avail_response(a: dict) -> AvailabilityResponse:
    return AvailabilityResponse(
        id=str(a["_id"]),
        pastor_id=str(a["pastor_id"]),
        day_of_week=a["day_of_week"],
        start_time=a["start_time"],
        end_time=a["end_time"],
    )


def _booking_response(b: dict) -> BookingResponse:
    return BookingResponse(
        id=str(b["_id"]),
        pastor_id=str(b["pastor_id"]),
        follower_id=str(b["follower_id"]),
        service_id=str(b["service_id"]),
        date=b["date"],
        start_time=b["start_time"],
        end_time=b["end_time"],
        mode=b["mode"],
        status=b["status"],
        meeting_link=b.get("meeting_link"),
    )


# Service Definition endpoints
@router.post("/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    data: CreateServiceRequest,
    user: CurrentUser = Depends(require_role(UserRole.pastor)),
    service: ServiceDefinitionService = Depends(_svc_service),
):
    svc = await service.create_service(user.user_id, data.model_dump())
    return _service_response(svc)


@router.get("/pastors/{pastor_id}/services", response_model=list[ServiceResponse])
async def list_pastor_services(
    pastor_id: str,
    service: ServiceDefinitionService = Depends(_svc_service),
):
    services = await service.get_by_pastor(pastor_id)
    return [_service_response(s) for s in services]


# Availability endpoints
@router.put("/availability", response_model=list[AvailabilityResponse])
async def set_availability(
    data: SetAvailabilityRequest,
    user: CurrentUser = Depends(require_role(UserRole.pastor)),
    service: AvailabilityService = Depends(_avail_service),
):
    slots = await service.set_availability(user.user_id, [s.model_dump() for s in data.slots])
    return [_avail_response(s) for s in slots]


@router.get("/pastors/{pastor_id}/availability", response_model=list[AvailabilityResponse])
async def get_pastor_availability(
    pastor_id: str,
    service: AvailabilityService = Depends(_avail_service),
):
    slots = await service.get_by_pastor(pastor_id)
    return [_avail_response(s) for s in slots]


# Booking endpoints
@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    data: CreateBookingRequest,
    user: CurrentUser = Depends(require_role(UserRole.follower)),
    db: AsyncIOMotorDatabase = Depends(get_database),
    svc_service: ServiceDefinitionService = Depends(_svc_service),
    avail_service: AvailabilityService = Depends(_avail_service),
    booking_service: BookingService = Depends(_booking_service),
):
    service_doc = await db.services.find_one({"_id": ObjectId(data.service_id)})
    if not service_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    is_available = await avail_service.check_available(
        db, data.pastor_id, data.date, data.start_time, service_doc["duration_minutes"],
    )
    if not is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Pastor is not available at this time",
        )

    booking = await booking_service.create_booking(user.user_id, data.model_dump(), service_doc)
    return _booking_response(booking)


@router.get("/bookings/me", response_model=list[BookingResponse])
async def my_bookings(
    user: CurrentUser = Depends(get_current_user),
    service: BookingService = Depends(_booking_service),
):
    bookings = await service.get_for_user(user.user_id, user.role.value)
    return [_booking_response(b) for b in bookings]


@router.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    data: UpdateBookingStatusRequest,
    user: CurrentUser = Depends(get_current_user),
    service: BookingService = Depends(_booking_service),
):
    updated = await service.update_status(booking_id, data.status.value)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return _booking_response(updated)
