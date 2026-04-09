from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.get("/lead/{lead_id}", response_model=list[schemas.PredictionDetailResponse])
def read_predictions_for_lead(lead_id: int, db: Session = Depends(get_db)):
    return crud.get_predictions_by_lead_id(db, lead_id)


@router.get("/", response_model=list[schemas.PredictionDetailResponse])
def read_predictions(db: Session = Depends(get_db)):
    return crud.get_predictions(db)


@router.get("/{prediction_id}", response_model=schemas.PredictionDetailResponse)
def read_prediction(prediction_id: int, db: Session = Depends(get_db)):
    prediction = crud.get_prediction_by_id(db, prediction_id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction