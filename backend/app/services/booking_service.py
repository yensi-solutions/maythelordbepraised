from datetime import date as date_type

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.base import utcnow
from app.services.base import BaseService


class ServiceDefinitionService(BaseService):
    async def create_service(self, pastor_id: str, data: dict) -> dict:
        doc = {
            "pastor_id": ObjectId(pastor_id),
            "name": data["name"],
            "description": data["description"],
            "category": data["category"],
            "duration_minutes": data["duration_minutes"],
            "price_cents": data.get("price_cents", 0),
            "mode": data.get("mode", "both"),
            "is_active": True,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def get_by_pastor(self, pastor_id: str) -> list[dict]:
        cursor = self.collection.find({
            "pastor_id": ObjectId(pastor_id),
            "is_active": True,
        })
        return await cursor.to_list(length=100)


class AvailabilityService(BaseService):
    async def set_availability(self, pastor_id: str, slots: list[dict]) -> list[dict]:
        await self.collection.delete_many({"pastor_id": ObjectId(pastor_id)})
        if not slots:
            return []
        docs = []
        for slot in slots:
            doc = {
                "pastor_id": ObjectId(pastor_id),
                "day_of_week": slot["day_of_week"],
                "start_time": slot["start_time"],
                "end_time": slot["end_time"],
                "created_at": utcnow(),
            }
            docs.append(doc)
        result = await self.collection.insert_many(docs)
        for doc, iid in zip(docs, result.inserted_ids):
            doc["_id"] = iid
        return docs

    async def get_by_pastor(self, pastor_id: str) -> list[dict]:
        cursor = self.collection.find({"pastor_id": ObjectId(pastor_id)})
        return await cursor.to_list(length=100)

    async def check_available(
        self, db: "AsyncIOMotorDatabase", pastor_id: str,
        date: str, start_time: str, duration_minutes: int,
    ) -> bool:
        booking_date = date_type.fromisoformat(date)
        day_name = booking_date.strftime("%A").lower()

        slots = await self.collection.find({
            "pastor_id": ObjectId(pastor_id),
            "day_of_week": day_name,
        }).to_list(length=100)

        if not slots:
            return False

        start_h, start_m = map(int, start_time.split(":"))
        req_start = start_h * 60 + start_m
        req_end = req_start + duration_minutes

        fits_slot = False
        for slot in slots:
            sh, sm = map(int, slot["start_time"].split(":"))
            eh, em = map(int, slot["end_time"].split(":"))
            if req_start >= sh * 60 + sm and req_end <= eh * 60 + em:
                fits_slot = True
                break
        if not fits_slot:
            return False

        existing = await db.bookings.find({
            "pastor_id": ObjectId(pastor_id),
            "date": date,
            "status": {"$in": ["pending", "confirmed"]},
        }).to_list(length=100)

        for booking in existing:
            bsh, bsm = map(int, booking["start_time"].split(":"))
            beh, bem = map(int, booking["end_time"].split(":"))
            b_start = bsh * 60 + bsm
            b_end = beh * 60 + bem
            if req_start < b_end and req_end > b_start:
                return False

        return True


class BookingService(BaseService):
    async def create_booking(self, follower_id: str, data: dict, service_doc: dict) -> dict:
        start_h, start_m = map(int, data["start_time"].split(":"))
        total_minutes = start_h * 60 + start_m + service_doc["duration_minutes"]
        end_time = f"{total_minutes // 60:02d}:{total_minutes % 60:02d}"

        doc = {
            "pastor_id": ObjectId(data["pastor_id"]),
            "follower_id": ObjectId(follower_id),
            "service_id": ObjectId(data["service_id"]),
            "date": data["date"],
            "start_time": data["start_time"],
            "end_time": end_time,
            "mode": data["mode"],
            "status": "pending",
            "meeting_link": None,
            "notes": None,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def get_for_user(self, user_id: str, role: str) -> list[dict]:
        if role == "pastor":
            query = {"pastor_id": ObjectId(user_id)}
        else:
            query = {"follower_id": ObjectId(user_id)}
        cursor = self.collection.find(query).sort("date", -1)
        return await cursor.to_list(length=100)

    async def update_status(self, booking_id: str, status: str) -> dict | None:
        await self.collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"status": status, "updated_at": utcnow()}},
        )
        return await self.get_by_id(booking_id)
