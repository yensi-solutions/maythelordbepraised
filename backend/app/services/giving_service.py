import stripe
from bson import ObjectId

from app.config import settings
from app.models.base import utcnow
from app.services.base import BaseService

stripe.api_key = settings.stripe_secret_key


class GivingService(BaseService):
    async def create_checkout_session(
        self,
        amount_cents: int,
        donation_type: str,
        pastor_id: str | None,
        donor_id: str,
        success_url: str,
        cancel_url: str,
    ) -> stripe.checkout.Session:
        metadata = {
            "donor_id": donor_id,
            "type": donation_type,
        }
        if pastor_id:
            metadata["pastor_id"] = pastor_id

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": f"Donation — {donation_type}"},
                    "unit_amount": amount_cents,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
        )
        return session

    async def record_donation(self, donor_id: str, data: dict) -> dict:
        doc = {
            "donor_id": ObjectId(donor_id),
            "amount_cents": data["amount_cents"],
            "type": data.get("type", "general"),
            "pastor_id": ObjectId(data["pastor_id"]) if data.get("pastor_id") else None,
            "stripe_payment_id": data.get("stripe_payment_id"),
            "created_at": utcnow(),
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def get_giving_history(self, donor_id: str) -> list[dict]:
        cursor = self.collection.find({"donor_id": ObjectId(donor_id)}).sort("created_at", -1)
        return await cursor.to_list(length=100)
