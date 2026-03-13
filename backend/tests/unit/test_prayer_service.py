import pytest
from app.services.prayer_service import PrayerService


@pytest.fixture
async def prayer_service(test_db):
    service = PrayerService(test_db.prayers)
    await test_db.prayers.delete_many({})
    yield service


async def test_create_prayer(prayer_service: PrayerService):
    prayer = await prayer_service.create_prayer("user123", {"text": "Please pray for healing"})
    assert prayer["text"] == "Please pray for healing"
    assert prayer["status"] == "active"
    assert prayer["pray_count"] == 0


async def test_create_anonymous_prayer(prayer_service: PrayerService):
    prayer = await prayer_service.create_prayer("user123", {"text": "Anonymous request", "is_anonymous": True})
    assert prayer["author_id"] is None
    assert prayer["is_anonymous"] is True


async def test_increment_pray_count(prayer_service: PrayerService):
    prayer = await prayer_service.create_prayer("user123", {"text": "Test"})
    updated = await prayer_service.increment_pray_count(str(prayer["_id"]))
    assert updated["pray_count"] == 1
    updated2 = await prayer_service.increment_pray_count(str(prayer["_id"]))
    assert updated2["pray_count"] == 2


async def test_add_pastor_response(prayer_service: PrayerService):
    prayer = await prayer_service.create_prayer("user123", {"text": "Need guidance"})
    updated = await prayer_service.add_pastor_response(str(prayer["_id"]), "pastor456", "I am praying for you")
    assert len(updated["pastor_responses"]) == 1
    assert updated["pastor_responses"][0]["text"] == "I am praying for you"


async def test_mark_answered(prayer_service: PrayerService):
    prayer = await prayer_service.create_prayer("user123", {"text": "Healing prayer"})
    answered = await prayer_service.mark_answered(str(prayer["_id"]), "God answered my prayer!")
    assert answered["status"] == "answered"
    assert answered["testimony"] == "God answered my prayer!"
