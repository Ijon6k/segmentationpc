import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config import settings
from app.routes import health, segment

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up FastAPI application...")
    yield
    logger.info("Shutting down FastAPI application...")

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Include routes
app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(segment.router, prefix=settings.API_PREFIX)
