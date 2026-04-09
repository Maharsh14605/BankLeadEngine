import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import get_db
from app.pdf_service import generate_offer_letter

router = APIRouter(prefix="/offers", tags=["Offers"])

@router.post("/generate/{lead_id}", response_model=schemas.OfferResponse)
def generate_offer(lead_id: int, db: Session = Depends(get_db)):
    lead = crud.get_lead_by_id(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    latest_prediction = (
        db.query(models.Prediction)
        .filter(models.Prediction.lead_id == lead_id)
        .order_by(models.Prediction.created_at.desc())
        .first()
    )
    
    if not latest_prediction:
        raise HTTPException(status_code=400, detail="Cannot generate offer without a prediction score")
        
    if latest_prediction.priority_band.lower() != "high":
         raise HTTPException(status_code=403, detail="Offer letters can only be generated for High priority leads")
         
    existing_offer = crud.get_offer_by_lead_id(db, lead_id)
    if existing_offer:
        return existing_offer
        
    file_path = generate_offer_letter(
        lead_id=lead.id,
        lead_name=lead.name,
        priority_band=latest_prediction.priority_band,
        propensity_score=latest_prediction.propensity_score
    )
    
    offer = crud.create_offer(db, lead_id, file_path)
    return offer

@router.get("/download/{offer_id}")
def download_offer(offer_id: int, db: Session = Depends(get_db)):
    offer = db.query(models.Offer).filter(models.Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    absolute_path = os.path.abspath(offer.file_path)
    if not os.path.exists(absolute_path):
        raise HTTPException(status_code=404, detail="PDF file is missing on the server")
        
    lead = crud.get_lead_by_id(db, offer.lead_id)
    display_name = lead.name.replace(" ", "_") if lead.name else "Lead"
    
    return FileResponse(
        path=absolute_path, 
        filename=f"Offer_Letter_{display_name}_{offer.lead_id}.pdf",
        media_type="application/pdf"
    )
