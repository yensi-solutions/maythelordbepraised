import pytest
from app.services.pastor_service import PastorService
from app.models.base import utcnow
from bson import ObjectId


@pytest.fixture
async def pastor_service(test_db):
    service = PastorService(test_db.users)
    await test_db.users.delete_many({})
    yield service


async def _create_pastor(db, visible=True) -> dict:
    doc = {
        "email": f"pastor-{ObjectId()}@test.com",
        "first_name": "John",
        "last_name": "Smith",
        "role": "pastor",
        "keycloak_id": f"kc-{ObjectId()}",
        "profile": {
            "bio": "A test pastor",
            "church_name": "Grace Church",
            "denomination": "Non-denominational",
            "location": "New York, NY",
            "specialties": ["counseling", "ceremony"],
            "is_visible": visible,
        },
        "created_at": utcnow(),
        "updated_at": utcnow(),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def test_get_public_pastors(pastor_service: PastorService, test_db):
    await _create_pastor(test_db, visible=True)
    await _create_pastor(test_db, visible=True)
    await _create_pastor(test_db, visible=False)

    pastors, total = await pastor_service.get_public_pastors()
    assert total == 2
    assert len(pastors) == 2


async def test_update_profile(pastor_service: PastorService, test_db):
    pastor = await _create_pastor(test_db)
    updated = await pastor_service.update_profile(
        str(pastor["_id"]),
        {"bio": "Updated bio", "church_name": "New Church"},
    )
    assert updated is not None
    assert updated["profile"]["bio"] == "Updated bio"
    assert updated["profile"]["church_name"] == "New Church"
    # Unchanged fields preserved
    assert updated["profile"]["denomination"] == "Non-denominational"


async def test_get_public_pastor(pastor_service: PastorService, test_db):
    pastor = await _create_pastor(test_db, visible=True)
    found = await pastor_service.get_public_pastor(str(pastor["_id"]))
    assert found is not None

    hidden = await _create_pastor(test_db, visible=False)
    not_found = await pastor_service.get_public_pastor(str(hidden["_id"]))
    assert not_found is None
