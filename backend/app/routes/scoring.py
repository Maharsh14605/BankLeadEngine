from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas, crud
from app.ml_service import score_lead, build_model_input_from_lead

router = APIRouter(prefix="/scoring", tags=["Scoring"])


@router.post("/score-lead", response_model=schemas.PredictionResponse)
def score_single_lead(lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    db_lead = crud.create_lead(db, lead)

    lead_dict = build_model_input_from_lead(db_lead)

    result = score_lead(lead_dict)

    db_prediction = crud.create_prediction(
        db=db,
        lead_id=db_lead.id,
        propensity_score=result["propensity_score"],
        predicted_label=result["predicted_label"],
        priority_band=result["priority_band"],
        threshold_used=result["threshold_used"]
    )

    return {
        "lead_id": db_lead.id,
        "prediction_id": db_prediction.id,
        "propensity_score": result["propensity_score"],
        "predicted_label": result["predicted_label"],
        "priority_band": result["priority_band"],
        "threshold_used": result["threshold_used"]
    }