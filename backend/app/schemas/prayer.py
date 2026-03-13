from pydantic import BaseModel


class CreatePrayerRequest(BaseModel):
    text: str
    is_anonymous: bool = False


class PrayerResponse(BaseModel):
    id: str
    author_id: str | None
    is_anonymous: bool
    text: str
    status: str
    pray_count: int
    testimony: str | None = None
    pastor_responses: list[dict] = []


class PrayerRespondRequest(BaseModel):
    text: str


class MarkAnsweredRequest(BaseModel):
    testimony: str | None = None
