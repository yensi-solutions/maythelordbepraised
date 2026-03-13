import pytest
from app.services.booking_service import ServiceDefinitionService, AvailabilityService, BookingService
from bson import ObjectId


PASTOR_ID = "665000000000000000000001"
FOLLOWER_ID = "665000000000000000000002"


@pytest.fixture
async def services(test_db):
    await test_db.services.delete_many({})
    await test_db.availability.delete_many({})
    await test_db.bookings.delete_many({})
    return {
        "svc": ServiceDefinitionService(test_db.services),
        "avail": AvailabilityService(test_db.availability),
        "booking": BookingService(test_db.bookings),
        "db": test_db,
    }


async def test_create_service(services):
    svc = await services["svc"].create_service(PASTOR_ID, {
        "name": "Marriage Counseling",
        "description": "1-on-1 sessions",
        "category": "counseling",
        "duration_minutes": 60,
        "price_cents": 0,
        "mode": "both",
    })
    assert svc["name"] == "Marriage Counseling"
    assert svc["pastor_id"] == ObjectId(PASTOR_ID)
    assert svc["is_active"] is True


async def test_get_services_by_pastor(services):
    await services["svc"].create_service(PASTOR_ID, {
        "name": "A", "description": "d", "category": "counseling", "duration_minutes": 60,
    })
    await services["svc"].create_service(PASTOR_ID, {
        "name": "B", "description": "d", "category": "ceremony", "duration_minutes": 120,
    })
    result = await services["svc"].get_by_pastor(PASTOR_ID)
    assert len(result) == 2


async def test_set_and_get_availability(services):
    slots = [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
        {"day_of_week": "wednesday", "start_time": "10:00", "end_time": "15:00"},
    ]
    result = await services["avail"].set_availability(PASTOR_ID, slots)
    assert len(result) == 2

    fetched = await services["avail"].get_by_pastor(PASTOR_ID)
    assert len(fetched) == 2


async def test_availability_replaces_existing(services):
    await services["avail"].set_availability(PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
    ])
    await services["avail"].set_availability(PASTOR_ID, [
        {"day_of_week": "tuesday", "start_time": "10:00", "end_time": "14:00"},
    ])
    fetched = await services["avail"].get_by_pastor(PASTOR_ID)
    assert len(fetched) == 1
    assert fetched[0]["day_of_week"] == "tuesday"


async def test_check_available_within_slot(services):
    await services["avail"].set_availability(PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
    ])
    # 2026-03-16 is a Monday
    available = await services["avail"].check_available(
        services["db"], PASTOR_ID, "2026-03-16", "10:00", 60,
    )
    assert available is True


async def test_check_unavailable_no_slot(services):
    await services["avail"].set_availability(PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
    ])
    # 2026-03-17 is a Tuesday
    available = await services["avail"].check_available(
        services["db"], PASTOR_ID, "2026-03-17", "10:00", 60,
    )
    assert available is False


async def test_check_unavailable_conflicting_booking(services):
    await services["avail"].set_availability(PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
    ])
    svc = await services["svc"].create_service(PASTOR_ID, {
        "name": "C", "description": "d", "category": "counseling", "duration_minutes": 60,
    })
    await services["booking"].create_booking(FOLLOWER_ID, {
        "pastor_id": PASTOR_ID,
        "service_id": str(svc["_id"]),
        "date": "2026-03-16",
        "start_time": "10:00",
        "mode": "virtual",
    }, svc)
    available = await services["avail"].check_available(
        services["db"], PASTOR_ID, "2026-03-16", "10:30", 60,
    )
    assert available is False
