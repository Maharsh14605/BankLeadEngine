from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import get_db
from app.shap_service import explain_lead
from app.ml_service import build_model_input_from_lead

router = APIRouter(prefix="/leads", tags=["Lead Details"])

@router.get("/{lead_id}/detail", response_model=schemas.LeadDetailResponse)
def get_lead_detail(lead_id: int, db: Session = Depends(get_db)):
    lead = crud.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    latest_prediction = (
        db.query(models.Prediction)
        .filter(models.Prediction.lead_id == lead_id)
        .order_by(models.Prediction.created_at.desc())
        .first()
    )
    
    offer = crud.get_offer_by_lead_id(db, lead_id)
    
    return {
        "lead": lead,
        "latest_prediction": latest_prediction,
        "offer": offer
    }

@router.get("/{lead_id}/explanation", response_model=schemas.SHAPExplanationResponse)
def get_lead_explanation(lead_id: int, db: Session = Depends(get_db)):
    lead = crud.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    # convert lead model to dict for ml pipeline
    lead_dict = build_model_input_from_lead(lead)
    
    explanation_data = explain_lead(lead_id, lead_dict)
    return explanation_data
