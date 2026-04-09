from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/leads", response_model=list[schemas.DashboardLeadResponse])
def read_dashboard_leads(db: Session = Depends(get_db)):
    return crud.get_dashboard_leads(db)