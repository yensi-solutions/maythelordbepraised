from typing import Generic, TypeVar

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

T = TypeVar("T")


class BaseService(Generic[T]):
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def get_by_id(self, id: str) -> dict | None:
        return await self.collection.find_one({"_id": ObjectId(id)})

    async def get_all(
        self, skip: int = 0, limit: int = 100, query: dict | None = None,
    ) -> list[dict]:
        q = query or {}
        cursor = self.collection.find(q).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def create(self, data: dict) -> dict:
        result = await self.collection.insert_one(data)
        data["_id"] = result.inserted_id
        return data

    async def update(self, id: str, data: dict) -> dict | None:
        await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": data},
        )
        return await self.get_by_id(id)

    async def delete(self, id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    async def count(self, query: dict | None = None) -> int:
        return await self.collection.count_documents(query or {})
