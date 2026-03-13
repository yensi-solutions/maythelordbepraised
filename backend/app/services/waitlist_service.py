from app.models.base import utcnow
from app.services.base import BaseService


class WaitlistService(BaseService):
    async def add_to_waitlist(self, data: dict) -> dict:
        existing = await self.collection.find_one({"email": data["email"]})
        if existing:
            return existing

        doc = {
            "email": data["email"],
            "source": data.get("source", "unknown"),
            "ip_address": data.get("ip_address"),
            "user_agent": data.get("user_agent"),
            "city": data.get("city"),
            "region": data.get("region"),
            "country": data.get("country"),
            "created_at": utcnow(),
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def get_all_entries(self) -> list[dict]:
        cursor = self.collection.find().sort("created_at", -1)
        return await cursor.to_list(length=1000)

    async def get_stats(self) -> dict:
        total = await self.collection.count_documents({})
        pipeline = [
            {"$group": {"_id": "$source", "count": {"$sum": 1}}},
        ]
        by_source = {}
        async for doc in self.collection.aggregate(pipeline):
            by_source[doc["_id"]] = doc["count"]
        return {"total": total, "by_source": by_source}
