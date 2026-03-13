from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config import settings
from app.api.middleware import setup_middleware
from app.api.v1.router import api_router
from app.db.mongodb import connect_db, close_db
from app.db.indexes import create_indexes
from app.core.logging import setup_logging

logger = setup_logging(settings.environment)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting MayTheLordBePraised API")
    db = await connect_db()
    await create_indexes(db)
    logger.info("Application started")
    yield
    await close_db()
    logger.info("Shutdown complete")


app = FastAPI(
    title="MayTheLordBePraised API",
    version="0.1.0",
    lifespan=lifespan,
)

setup_middleware(app, settings)
app.include_router(api_router, prefix="/api/v1")
