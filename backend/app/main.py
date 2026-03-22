from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import scoring, leads

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bank Lead Conversion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scoring.router)
app.include_router(leads.router)


@app.get("/")
def root():
    return {"message": "Bank Lead Conversion API is running"}