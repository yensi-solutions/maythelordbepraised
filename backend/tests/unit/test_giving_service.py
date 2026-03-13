import pytest
from app.services.giving_service import GivingService
from bson import ObjectId


DONOR_ID = "665000000000000000000001"


@pytest.fixture
async def giving_service(test_db):
    service = GivingService(test_db.donations)
    await test_db.donations.delete_many({})
    yield service


async def test_record_donation(giving_service: GivingService):
    donation = await giving_service.record_donation(DONOR_ID, {
        "amount_cents": 5000,
        "type": "tithe",
        "pastor_id": None,
        "stripe_payment_id": "pi_test_123",
    })
    assert donation["amount_cents"] == 5000
    assert donation["type"] == "tithe"
    assert donation["stripe_payment_id"] == "pi_test_123"


async def test_get_giving_history(giving_service: GivingService):
    await giving_service.record_donation(DONOR_ID, {
        "amount_cents": 1000, "type": "general", "stripe_payment_id": "pi_1",
    })
    await giving_service.record_donation(DONOR_ID, {
        "amount_cents": 2500, "type": "offering", "stripe_payment_id": "pi_2",
    })
    history = await giving_service.get_giving_history(DONOR_ID)
    assert len(history) == 2
