import pytest
from app.services.auth_service import AuthService
from bson import ObjectId


@pytest.fixture
async def auth_service(test_db):
    service = AuthService(test_db.users)
    await test_db.users.delete_many({})
    yield service


async def test_register_user(auth_service: AuthService):
    user = await auth_service.register_user({
        "email": "pastor@test.com",
        "first_name": "John",
        "last_name": "Smith",
        "role": "pastor",
        "keycloak_id": "kc-123",
    })
    assert user["email"] == "pastor@test.com"
    assert user["role"] == "pastor"
    assert user["keycloak_id"] == "kc-123"
    assert "_id" in user


async def test_register_duplicate_email(auth_service: AuthService):
    await auth_service.register_user({
        "email": "dup@test.com",
        "first_name": "A",
        "last_name": "B",
        "role": "follower",
        "keycloak_id": "kc-1",
    })
    with pytest.raises(ValueError, match="Email already registered"):
        await auth_service.register_user({
            "email": "dup@test.com",
            "first_name": "C",
            "last_name": "D",
            "role": "follower",
            "keycloak_id": "kc-2",
        })


async def test_get_by_keycloak_id(auth_service: AuthService):
    await auth_service.register_user({
        "email": "kc@test.com",
        "first_name": "KC",
        "last_name": "User",
        "role": "follower",
        "keycloak_id": "kc-456",
    })
    found = await auth_service.get_by_keycloak_id("kc-456")
    assert found is not None
    assert found["email"] == "kc@test.com"

    not_found = await auth_service.get_by_keycloak_id("kc-nonexistent")
    assert not_found is None
