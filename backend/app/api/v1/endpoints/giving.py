import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user, get_database
from app.config import settings
from app.schemas.giving import CheckoutResponse, CreateCheckoutRequest, DonationResponse
from app.schemas.user import CurrentUser
from app.services.giving_service import GivingService

router = APIRouter()


def get_giving_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> GivingService:
    return GivingService(db.donations)


def _donation_response(d: dict) -> DonationResponse:
    return DonationResponse(
        id=str(d["_id"]),
        donor_id=str(d["donor_id"]),
        amount_cents=d["amount_cents"],
        type=d.get("type", "general"),
        pastor_id=str(d["pastor_id"]) if d.get("pastor_id") else None,
        stripe_payment_id=d.get("stripe_payment_id"),
        created_at=(
            d["created_at"].isoformat()
            if hasattr(d["created_at"], "isoformat")
            else str(d["created_at"])
        ),
    )


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    data: CreateCheckoutRequest,
    user: CurrentUser = Depends(get_current_user),
    service: GivingService = Depends(get_giving_service),
):
    try:
        session = await service.create_checkout_session(
            amount_cents=data.amount_cents,
            donation_type=data.type.value,
            pastor_id=data.pastor_id,
            donor_id=user.user_id,
            success_url=data.success_url,
            cancel_url=data.cancel_url,
        )
    except stripe.StripeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return CheckoutResponse(checkout_url=session.url, session_id=session.id)


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    service: GivingService = Depends(get_giving_service),
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret,
        )
    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        await service.record_donation(metadata["donor_id"], {
            "amount_cents": session["amount_total"],
            "type": metadata.get("type", "general"),
            "pastor_id": metadata.get("pastor_id"),
            "stripe_payment_id": session.get("payment_intent"),
        })

    return {"status": "ok"}


@router.get("/me", response_model=list[DonationResponse])
async def my_giving(
    user: CurrentUser = Depends(get_current_user),
    service: GivingService = Depends(get_giving_service),
):
    donations = await service.get_giving_history(user.user_id)
    return [_donation_response(d) for d in donations]


@router.get("/received", response_model=list[DonationResponse])
async def received_donations(
    user: CurrentUser = Depends(get_current_user),
    service: GivingService = Depends(get_giving_service),
):
    donations = await service.get_received_donations(user.user_id)
    return [_donation_response(d) for d in donations]
