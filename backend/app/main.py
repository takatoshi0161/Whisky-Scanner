from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.health import router as health_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(title="Whisky Scanner API", lifespan=lifespan)

app.include_router(health_router)
