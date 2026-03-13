import pytest
import os
from motor.motor_asyncio import AsyncIOMotorClient


@pytest.fixture
async def test_db():
    client = AsyncIOMotorClient(
        os.getenv("MONGODB_URL", f"mongodb://localhost:{os.getenv('MONGODB_PORT', '15783')}")
    )
    db = client["test_maythelordbepraised"]
    yield db
    await client.drop_database("test_maythelordbepraised")
    client.close()
