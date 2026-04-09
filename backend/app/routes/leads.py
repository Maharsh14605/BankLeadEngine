from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.get("/", response_model=list[schemas.LeadResponse])
def read_leads(db: Session = Depends(get_db)):
    return crud.get_leads(db)


@router.get("/{lead_id}", response_model=schemas.LeadResponse)
def read_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = crud.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead