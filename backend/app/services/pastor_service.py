from app.services.base import BaseService
from app.models.base import utcnow
from bson import ObjectId


class PastorService(BaseService):
    async def update_profile(self, user_id: str, data: dict) -> dict | None:
        update_data = {k: v for k, v in data.items() if v is not None}
        if not update_data:
            return await self.get_by_id(user_id)

        profile_update = {f"profile.{k}": v for k, v in update_data.items()}
        profile_update["updated_at"] = utcnow()

        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": profile_update},
        )
        return await self.get_by_id(user_id)

    async def get_public_pastors(self, skip: int = 0, limit: int = 20) -> tuple[list[dict], int]:
        query = {"role": "pastor", "profile.is_visible": True}
        total = await self.collection.count_documents(query)
        cursor = self.collection.find(query).skip(skip).limit(limit)
        pastors = await cursor.to_list(length=limit)
        return pastors, total

    async def get_public_pastor(self, pastor_id: str) -> dict | None:
        doc = await self.collection.find_one({
            "_id": ObjectId(pastor_id),
            "role": "pastor",
            "profile.is_visible": True,
        })
        return doc
