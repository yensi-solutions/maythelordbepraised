from pydantic import BaseModel, EmailStr


class WaitlistRequest(BaseModel):
    email: EmailStr
    source: str = "unknown"  # "pastor-portal" or "follower-portal"


class WaitlistResponse(BaseModel):
    id: str
    email: str
    source: str
    ip_address: str | None = None
    user_agent: str | None = None
    city: str | None = None
    region: str | None = None
    country: str | None = None
    created_at: str


class WaitlistStatsResponse(BaseModel):
    total: int
    by_source: dict[str, int]
    entries: list[WaitlistResponse]
