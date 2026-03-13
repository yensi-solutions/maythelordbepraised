from pydantic import BaseModel
from enum import Enum


class DonationType(str, Enum):
    general = "general"
    tithe = "tithe"
    offering = "offering"
    missions = "missions"
    building = "building"


class CreateCheckoutRequest(BaseModel):
    amount_cents: int
    type: DonationType = DonationType.general
    pastor_id: str | None = None
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str


class DonationResponse(BaseModel):
    id: str
    donor_id: str
    amount_cents: int
    type: str
    pastor_id: str | None
    stripe_payment_id: str | None
    created_at: str
