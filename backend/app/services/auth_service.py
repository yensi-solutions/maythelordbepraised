from app.services.base import BaseService
from app.models.base import utcnow
from bson import ObjectId


class AuthService(BaseService):
    async def register_user(self, data: dict) -> dict:
        existing = await self.collection.find_one({"email": data["email"]})
        if existing:
            raise ValueError("Email already registered")

        existing_kc = await self.collection.find_one({"keycloak_id": data["keycloak_id"]})
        if existing_kc:
            raise ValueError("Keycloak user already registered")

        doc = {
            "email": data["email"],
            "first_name": data["first_name"],
            "last_name": data["last_name"],
            "role": data["role"],
            "keycloak_id": data["keycloak_id"],
            "profile": {},
            "subscription": {
                "tier": "shepherd",
                "status": "active",
            },
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def get_by_keycloak_id(self, keycloak_id: str) -> dict | None:
        return await self.collection.find_one({"keycloak_id": keycloak_id})

    async def get_user_profile(self, user_id: str) -> dict | None:
        return await self.get_by_id(user_id)
