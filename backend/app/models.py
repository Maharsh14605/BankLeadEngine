from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)

    age = Column(Integer, nullable=False)
    job = Column(String, nullable=False)
    marital = Column(String, nullable=False)
    education = Column(String, nullable=False)
    default = Column(String, nullable=False)
    housing = Column(String, nullable=False)
    loan = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    month = Column(String, nullable=False)
    day_of_week = Column(String, nullable=False)

    campaign = Column(Integer, nullable=False)
    pdays = Column(Integer, nullable=False)
    previous = Column(Integer, nullable=False)
    poutcome = Column(String, nullable=False)

    emp_var_rate = Column(Float, nullable=False)
    cons_price_idx = Column(Float, nullable=False)
    cons_conf_idx = Column(Float, nullable=False)
    euribor3m = Column(Float, nullable=False)
    nr_employed = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="lead")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)

    propensity_score = Column(Float, nullable=False)
    predicted_label = Column(Integer, nullable=False)
    priority_band = Column(String, nullable=False)
    threshold_used = Column(Float, nullable=False)
    model_version = Column(String, nullable=False, default="improved_random_forest_v1")

    created_at = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="predictions")
    
