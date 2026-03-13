from pydantic import BaseModel
from enum import Enum


class ServiceCategory(str, Enum):
    counseling = "counseling"
    ceremony = "ceremony"
    visit = "visit"
    pre_marital = "pre_marital"
    other = "other"


class ServiceMode(str, Enum):
    in_person = "in_person"
    virtual = "virtual"
    both = "both"


class CreateServiceRequest(BaseModel):
    name: str
    description: str
    category: ServiceCategory
    duration_minutes: int
    price_cents: int = 0
    mode: ServiceMode = ServiceMode.both


class ServiceResponse(BaseModel):
    id: str
    pastor_id: str
    name: str
    description: str
    category: ServiceCategory
    duration_minutes: int
    price_cents: int
    mode: ServiceMode
    is_active: bool


class DayOfWeek(str, Enum):
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"
    sunday = "sunday"


class AvailabilitySlot(BaseModel):
    day_of_week: DayOfWeek
    start_time: str  # HH:MM
    end_time: str  # HH:MM


class SetAvailabilityRequest(BaseModel):
    slots: list[AvailabilitySlot]


class AvailabilityResponse(BaseModel):
    id: str
    pastor_id: str
    day_of_week: str
    start_time: str
    end_time: str


class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


class CreateBookingRequest(BaseModel):
    pastor_id: str
    service_id: str
    date: str  # YYYY-MM-DD
    start_time: str  # HH:MM
    mode: str  # in_person or virtual


class BookingResponse(BaseModel):
    id: str
    pastor_id: str
    follower_id: str
    service_id: str
    date: str
    start_time: str
    end_time: str
    mode: str
    status: BookingStatus
    meeting_link: str | None = None


class UpdateBookingStatusRequest(BaseModel):
    status: BookingStatus
