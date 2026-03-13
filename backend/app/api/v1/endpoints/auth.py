from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_database, get_current_user
from app.schemas.user import RegisterRequest, RegisterResponse, UserProfileResponse, CurrentUser
from app.services.auth_service import AuthService

router = APIRouter()


def get_auth_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> AuthService:
    return AuthService(db.users)


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    service: AuthService = Depends(get_auth_service),
):
    try:
        user = await service.register_user(data.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return RegisterResponse(
        id=str(user["_id"]),
        email=user["email"],
        role=user["role"],
    )


@router.get("/me", response_model=UserProfileResponse)
async def get_me(
    current_user: CurrentUser = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
):
    if not current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not registered in system",
        )
    user = await service.get_user_profile(current_user.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserProfileResponse(
        id=str(user["_id"]),
        email=user["email"],
        role=user["role"],
        first_name=user["first_name"],
        last_name=user["last_name"],
    )
