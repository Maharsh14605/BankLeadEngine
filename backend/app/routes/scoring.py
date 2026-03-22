from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas, crud
from app.ml_service import score_lead

router = APIRouter(prefix="/scoring", tags=["Scoring"])


@router.post("/score-lead", response_model=schemas.PredictionResponse)
def score_single_lead(lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    db_lead = crud.create_lead(db, lead)

    lead_dict = {
        "age": db_lead.age,
        "job": db_lead.job,
        "marital": db_lead.marital,
        "education": db_lead.education,
        "default": db_lead.default,
        "housing": db_lead.housing,
        "loan": db_lead.loan,
        "contact": db_lead.contact,
        "month": db_lead.month,
        "day_of_week": db_lead.day_of_week,
        "campaign": db_lead.campaign,
        "pdays": db_lead.pdays,
        "previous": db_lead.previous,
        "poutcome": db_lead.poutcome,
        "emp.var.rate": db_lead.emp_var_rate,
        "cons.price.idx": db_lead.cons_price_idx,
        "cons.conf.idx": db_lead.cons_conf_idx,
        "euribor3m": db_lead.euribor3m,
        "nr.employed": db_lead.nr_employed
    }

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