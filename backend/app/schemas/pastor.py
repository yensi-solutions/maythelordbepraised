from pydantic import BaseModel


class PastorProfileUpdate(BaseModel):
    bio: str | None = None
    church_name: str | None = None
    denomination: str | None = None
    location: str | None = None
    photo_url: str | None = None
    specialties: list[str] | None = None
    is_visible: bool | None = None


class PastorProfileResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    bio: str
    church_name: str
    denomination: str
    location: str
    photo_url: str | None
    specialties: list[str]
    is_visible: bool


class PastorListResponse(BaseModel):
    pastors: list[PastorProfileResponse]
    total: int
