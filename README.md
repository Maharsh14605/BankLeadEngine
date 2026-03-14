# Bank Lead Conversion & Propensity Engine

A full-stack banking lead prioritization system that predicts lead conversion propensity, explains predictions with SHAP, ranks leads for outreach, and generates PDF offer letters for high-priority leads.

## Tech Stack
- Frontend: React
- Backend: FastAPI
- ML: scikit-learn / LightGBM
- Explainability: SHAP
- Database: SQLite

## Dataset
- UCI Bank Marketing Dataset
- File used: `data/raw/bank-additional-full.csv`

## Project Structure
- `backend/` - FastAPI backend and ML services
- `frontend/` - React dashboard
- `data/` - raw dataset and processed data
- `notebooks/` - EDA and training notebooks