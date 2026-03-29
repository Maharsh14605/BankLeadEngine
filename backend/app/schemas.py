from datetime import datetime
from pydantic import BaseModel


class LeadCreate(BaseModel):
    name: str | None = None

    age: int
    job: str
    marital: str
    education: str
    default: str
    housing: str
    loan: str
    contact: str
    month: str
    day_of_week: str

    campaign: int
    pdays: int
    previous: int
    poutcome: str

    emp_var_rate: float
    cons_price_idx: float
    cons_conf_idx: float
    euribor3m: float
    nr_employed: float


class PredictionResponse(BaseModel):
    lead_id: int
    prediction_id: int
    propensity_score: float
    predicted_label: int
    priority_band: str
    threshold_used: float

    class Config:
        from_attributes = True


class LeadResponse(BaseModel):
    id: int
    name: str | None = None
    age: int
    job: str
    marital: str
    education: str
    default: str
    housing: str
    loan: str
    contact: str
    month: str
    day_of_week: str
    campaign: int
    pdays: int
    previous: int
    poutcome: str
    emp_var_rate: float
    cons_price_idx: float
    cons_conf_idx: float
    euribor3m: float
    nr_employed: float
    created_at: datetime

    class Config:
        from_attributes = True
        
class PredictionDetailResponse(BaseModel):
    id: int
    lead_id: int
    propensity_score: float
    predicted_label: int
    priority_band: str
    threshold_used: float
    model_version: str
    created_at: datetime

    class Config:
        from_attributes = True