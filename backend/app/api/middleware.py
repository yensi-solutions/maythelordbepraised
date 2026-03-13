from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import Settings


def setup_middleware(app: FastAPI, settings: Settings) -> None:
    if settings.environment == "production":
        origins = [settings.pastor_portal_url, settings.follower_portal_url]
    else:
        origins = [
            f"http://localhost:{settings.backend_port - 2}",  # pastor portal
            f"http://localhost:{settings.backend_port - 1}",  # follower portal
            settings.pastor_portal_url,
            settings.follower_portal_url,
        ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def add_security_headers(request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response
