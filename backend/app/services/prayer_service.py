from app.services.base import BaseService
from app.models.base import utcnow
from pymongo import ReturnDocument
from bson import ObjectId


class PrayerService(BaseService):
    async def create_prayer(self, author_id: str | None, data: dict) -> dict:
        doc = {
            "author_id": ObjectId(author_id) if author_id and not data.get("is_anonymous") else None,
            "is_anonymous": data.get("is_anonymous", False),
            "text": data["text"],
            "status": "active",
            "pray_count": 0,
            "testimony": None,
            "pastor_responses": [],
            "assigned_pastor_id": None,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def get_prayers(self, status: str | None = None, skip: int = 0, limit: int = 20) -> list[dict]:
        query = {}
        if status:
            query["status"] = status
        cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def increment_pray_count(self, prayer_id: str) -> dict | None:
        return await self.collection.find_one_and_update(
            {"_id": ObjectId(prayer_id)},
            {"$inc": {"pray_count": 1}},
            return_document=ReturnDocument.AFTER,
        )

    async def add_pastor_response(self, prayer_id: str, pastor_id: str, text: str) -> dict | None:
        response_doc = {
            "pastor_id": pastor_id,
            "text": text,
            "created_at": utcnow(),
        }
        return await self.collection.find_one_and_update(
            {"_id": ObjectId(prayer_id)},
            {
                "$push": {"pastor_responses": response_doc},
                "$set": {"updated_at": utcnow()},
            },
            return_document=ReturnDocument.AFTER,
        )

    async def mark_answered(self, prayer_id: str, testimony: str | None = None) -> dict | None:
        update: dict = {"status": "answered", "updated_at": utcnow()}
        if testimony:
            update["testimony"] = testimony
        return await self.collection.find_one_and_update(
            {"_id": ObjectId(prayer_id)},
            {"$set": update},
            return_document=ReturnDocument.AFTER,
        )
