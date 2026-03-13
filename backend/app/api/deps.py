from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_db
from app.core.security import verify_token
from app.models.user import UserRole
from app.schemas.user import CurrentUser

security = HTTPBearer()


async def get_database() -> AsyncIOMotorDatabase:
    return await get_db()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
) -> CurrentUser:
    token = credentials.credentials
    payload = await verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    email = payload.get("email", "")
    realm_access = payload.get("realm_access", {})
    roles = realm_access.get("roles", [])

    role = UserRole.follower
    if "pastor" in roles:
        role = UserRole.pastor
    elif "admin" in roles:
        role = UserRole.admin

    # Look up user in DB
    user_doc = await db.users.find_one({"keycloak_id": payload["sub"]})
    user_id = str(user_doc["_id"]) if user_doc else None

    return CurrentUser(
        keycloak_id=payload["sub"],
        email=email,
        role=role,
        user_id=user_id,
    )


def require_role(*roles: UserRole):
    async def _check(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of: {[r.value for r in roles]}",
            )
        return user
    return _check
