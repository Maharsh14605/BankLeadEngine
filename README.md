# Bank Lead Conversion Dashboard

A full stack AI-powered banking CRM prototype that helps rank potential customers by likelihood to convert, explain prediction outcomes, and generate premium offer letters for high-priority leads.

## Overview

Bank Lead Conversion Dashboard is a machine learning and software engineering project that simulates how a bank might prioritize leads for outreach. The system scores leads using a trained classification model, stores results in a database, explains predictions using SHAP, and allows users to generate PDF offer letters for highly qualified leads.

This project combines:

- Machine learning
- Explainable AI
- REST API development
- SQL database design
- Frontend dashboard development

## Features

### Core ML Features

- Predicts lead conversion likelihood using a trained Random Forest model
- Returns a propensity score
- Classifies leads into Low, Medium, and High priority bands
- Uses engineered features to improve prediction quality
- Evaluated with cross-validation and holdout testing

### Explainability

- Uses SHAP to explain why a lead scored the way it did
- Shows top positive and negative contributing factors
- Generates a short business-friendly explanation summary

### Backend Features

- FastAPI REST API
- SQLite database with SQLAlchemy ORM
- Lead storage and prediction history
- Dashboard summary endpoint
- Lead detail endpoint
- Offer generation and PDF download endpoints

### Frontend Features

- React + Vite dashboard
- KPI summary cards
- Lead scoring form
- Search, filter, and sort controls
- Clickable lead rows
- Lead detail modal with:
  - Profile summary
  - Prediction summary
  - SHAP explanation
  - Offer generation workflow

### Offer Workflow

- Generates PDF offer letters for high-priority leads
- Stores offer metadata in the database
- Allows download of generated PDF files

## Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

### Machine Learning

- scikit-learn
- Random Forest Classifier
- SHAP
- pandas
- numpy
- joblib

### PDF Generation

- ReportLab

## Project Structure

```text
bankLeadEngine/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── ml_service.py
│   │   ├── models.py
│   │   ├── pdf_service.py
│   │   ├── schemas.py
│   │   └── shap_service.py
│   ├── trained_models/
│   ├── improve_random_forest.py
│   ├── requirements.txt
│   └── .venv/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── data/
│   ├── raw/
│   └── offers/
└── README.md
```

## Machine Learning Workflow

### Dataset

This project uses the UCI Bank Marketing Dataset, which contains marketing campaign and client information related to whether a customer subscribed to a banking product.

### Modeling Process

1. Loaded and explored the dataset
2. Removed leakage-prone fields such as `duration`
3. Built a baseline Random Forest model
4. Compared alternative models
5. Improved the final model using:
   - Feature engineering
   - Threshold tuning
   - Cross-validation
6. Saved the trained pipeline for backend use

### Feature Engineering

The final model includes engineered features such as:

- `was_contacted_before`
- `never_contacted_before`
- `previously_successful`
- `has_any_loan`
- `is_married`
- `is_weekday_mon_thu`

### Final Model Performance

#### Cross-Validation

- Accuracy: **0.8631**
- Precision: **0.4225**
- Recall: **0.5870**
- F1 Score: **0.4913**
- ROC AUC: **0.7939**

#### Final Test Metrics

- Accuracy: **0.8986**
- Precision: **0.5578**
- Recall: **0.4838**
- F1 Score: **0.5182**
- ROC AUC: **0.8136**

These results showed that the tuned Random Forest model was stable and suitable for prioritizing higher-confidence leads in a CRM setting.

## API Endpoints

### Existing Core Endpoints

- `POST /scoring/score-lead`
- `GET /dashboard/leads`
- `GET /leads/`
- `GET /leads/{lead_id}`
- `GET /predictions/`
- `GET /predictions/{prediction_id}`
- `GET /predictions/lead/{lead_id}`

### Advanced Feature Endpoints

- `GET /leads/{lead_id}/detail`
- `GET /leads/{lead_id}/explanation`
- `POST /offers/generate/{lead_id}`
- `GET /offers/download/{offer_id}`

## Database Design

### `leads`

Stores all lead or customer input fields.

### `predictions`

Stores model outputs such as:

- Propensity score
- Predicted label
- Priority band
- Threshold used
- Model version

### `offers`

Stores generated offer metadata such as:

- Lead ID
- File path
- Status
- Created date

## How It Works

1. A user enters lead details through the frontend form
2. The frontend sends data to `POST /scoring/score-lead`
3. The backend:
   - Saves the lead to SQLite
   - Scores the lead using the saved ML pipeline
   - Saves the prediction
4. The dashboard refreshes and shows the scored lead
5. Clicking a row opens the lead detail modal
6. The modal shows:
   - Lead data
   - Latest prediction
   - SHAP explanation
   - Offer generation controls
7. If the lead is high priority, the user can generate and download a PDF offer letter

## Running the Project

### 1. Start the backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

Backend runs at:

`http://127.0.0.1:8000`

FastAPI docs:

`http://127.0.0.1:8000/docs`

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## Example Test Lead

You can test the app by submitting a lead through the frontend form.

Example values:

- Name: John Smith
- Age: 42
- Job: management
- Marital: married
- Education: university.degree
- Default: no
- Housing: yes
- Loan: no
- Contact: cellular
- Month: may
- Day of Week: mon
- Campaign: 1
- Pdays: 999
- Previous: 0
- Poutcome: nonexistent
- Emp Var Rate: 1.1
- Cons Price Idx: 93.994
- Cons Conf Idx: -36.4
- Euribor 3m: 4.857
- Nr Employed: 5191

## Example Use Cases

- Score new marketing leads
- Rank leads by conversion probability
- Explain predictions to internal users
- Generate offer letters for strong leads
- Demonstrate full stack AI product development

## Why This Project Matters

This project demonstrates the ability to build an end to end applied AI system, not just a model notebook. It shows skills in:

- Model training and evaluation
- Feature engineering
- Explainable AI
- API development
- Database integration
- Frontend dashboard design
- PDF workflow automation

## Future Improvements

Possible future additions:

- Authentication and login
- PostgreSQL deployment version
- Batch lead upload via CSV
- Charts for lead analytics
- Model retraining workflow
- Email delivery of offer letters
- More advanced SHAP visualizations

## Author

**Maharsh Patel**

Built as a full stack machine learning project focused on banking lead prioritization, explainable AI, and CRM workflow automation.
