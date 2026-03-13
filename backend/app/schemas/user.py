from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class RegisterRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    keycloak_id: str


class RegisterResponse(BaseModel):
    id: str
    email: str
    role: UserRole
    message: str = "Registration successful"


class UserProfileResponse(BaseModel):
    id: str
    email: str
    role: UserRole
    first_name: str
    last_name: str


class CurrentUser(BaseModel):
    keycloak_id: str
    email: str
    role: UserRole
    user_id: str | None = None
