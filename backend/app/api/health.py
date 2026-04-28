from fastapi import APIRouter

from app.db.session import check_database_connection

router = APIRouter()


@router.get("/health")
def healthcheck() -> dict[str, str]:
    db_status = "ok" if check_database_connection() else "error"
    app_status = "ok" if db_status == "ok" else "degraded"
    return {
        "status": app_status,
        "database": db_status,
    }
