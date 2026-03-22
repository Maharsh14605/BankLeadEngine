from sqlalchemy.orm import Session

from app import models, schemas


def create_lead(db: Session, lead: schemas.LeadCreate):
    db_lead = models.Lead(
        name=lead.name,
        age=lead.age,
        job=lead.job,
        marital=lead.marital,
        education=lead.education,
        default=lead.default,
        housing=lead.housing,
        loan=lead.loan,
        contact=lead.contact,
        month=lead.month,
        day_of_week=lead.day_of_week,
        campaign=lead.campaign,
        pdays=lead.pdays,
        previous=lead.previous,
        poutcome=lead.poutcome,
        emp_var_rate=lead.emp_var_rate,
        cons_price_idx=lead.cons_price_idx,
        cons_conf_idx=lead.cons_conf_idx,
        euribor3m=lead.euribor3m,
        nr_employed=lead.nr_employed
    )

    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead


def create_prediction(
    db: Session,
    lead_id: int,
    propensity_score: float,
    predicted_label: int,
    priority_band: str,
    threshold_used: float,
    model_version: str = "improved_random_forest_v1"
):
    db_prediction = models.Prediction(
        lead_id=lead_id,
        propensity_score=propensity_score,
        predicted_label=predicted_label,
        priority_band=priority_band,
        threshold_used=threshold_used,
        model_version=model_version
    )

    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction


def get_leads(db: Session):
    return db.query(models.Lead).all()


def get_lead_by_id(db: Session, lead_id: int):
    return db.query(models.Lead).filter(models.Lead.id == lead_id).first()