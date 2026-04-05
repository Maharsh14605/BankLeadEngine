import joblib
import pandas as pd
import shap
from app.ml_service import MODEL_PATH, add_engineered_features

pipeline = joblib.load(MODEL_PATH)
model = pipeline.named_steps["model"]
preprocessor = pipeline.named_steps["preprocessor"]

explainer = shap.TreeExplainer(model)

FEATURE_NAME_MAP = {
    "num__age": "Age",
    "num__campaign": "Campaign Contacts",
    "num__pdays": "Days Since Last Contact",
    "num__previous": "Previous Contacts",
    "num__emp.var.rate": "Employment Variation Rate",
    "num__cons.price.idx": "Consumer Price Index",
    "num__cons.conf.idx": "Consumer Confidence Index",
    "num__euribor3m": "Euribor 3 Month Rate",
    "num__nr.employed": "Number of Employees",
    "num__was_contacted_before": "Previously Contacted",
    "num__never_contacted_before": "Never Contacted Before",
    "num__previously_successful": "Previously Successful",
    "num__has_any_loan": "Has Active Loan",
    "num__is_married": "Is Married",
    "num__is_weekday_mon_thu": "Contacted Early in Week",
    
    "cat__job_admin.": "Job: Admin",
    "cat__job_blue-collar": "Job: Blue Collar",
    "cat__job_entrepreneur": "Job: Entrepreneur",
    "cat__job_housemaid": "Job: Housemaid",
    "cat__job_management": "Job: Management",
    "cat__job_retired": "Job: Retired",
    "cat__job_self-employed": "Job: Self-employed",
    "cat__job_services": "Job: Services",
    "cat__job_student": "Job: Student",
    "cat__job_technician": "Job: Technician",
    "cat__job_unemployed": "Job: Unemployed",
    
    "cat__marital_divorced": "Marital Status: Divorced",
    "cat__marital_married": "Marital Status: Married",
    "cat__marital_single": "Marital Status: Single",
    
    "cat__education_university.degree": "Education: University Degree",
    "cat__education_high.school": "Education: High School",
    "cat__education_basic.9y": "Education: Basic 9Y",
    
    "cat__poutcome_success": "Previous Outcome: Success",
    "cat__poutcome_failure": "Previous Outcome: Failure",
    "cat__poutcome_nonexistent": "Previous Outcome: Nonexistent",
    
    "cat__contact_cellular": "Contact Type: Cellular",
    "cat__contact_telephone": "Contact Type: Telephone"
}

def clean_feature_name(raw_name: str) -> str:
    return FEATURE_NAME_MAP.get(raw_name, raw_name.replace("cat__", "").replace("num__", "").replace("_", " ").title())

def explain_lead(lead_id: int, lead_data: dict) -> dict:
    df = pd.DataFrame([lead_data])
    df = add_engineered_features(df)
    
    # Transform exactly as pipeline does
    X_transformed = preprocessor.transform(df)
    
    # Explainer outputs list for each class in RF -> [0] is negative class, [1] is positive class
    shap_values = explainer.shap_values(X_transformed)
    
    # We care about the positive class (class 1 -> conversion)
    # the output structure in older SHAP vs newer SHAP for RF might be different, commonly it's a list:
    if isinstance(shap_values, list):
        pos_class_shap = shap_values[1][0]
    else:
        # For some TreeExplainer configurations, shap_values has shape (n_samples, n_features, n_classes)
        if len(shap_values.shape) == 3:
            pos_class_shap = shap_values[0, :, 1]
        else:
            pos_class_shap = shap_values[0]

    feature_names = preprocessor.get_feature_names_out()
    
    # Pair and sort
    feature_contributions = []
    for fn, contrib in zip(feature_names, pos_class_shap):
        if abs(contrib) > 0.001:
            feature_contributions.append({
                "feature_name": clean_feature_name(fn),
                "contribution": float(contrib)
            })
            
    # Sort by magnitude of impact
    feature_contributions.sort(key=lambda x: x["contribution"], reverse=True)
    
    positive_features = [f for f in feature_contributions if f["contribution"] > 0][:5]
    negative_features = [f for f in feature_contributions if f["contribution"] < 0]
    negative_features.sort(key=lambda x: x["contribution"]) # most negative first
    negative_features = negative_features[:5]
    
    # Generate summary string
    if positive_features and negative_features:
        pos_names = [f["feature_name"] for f in positive_features[:2]]
        neg_names = [f["feature_name"] for f in negative_features[:2]]
        summary = (
            f"This lead scored higher primarily because of {', '.join(pos_names)}. "
            f"However, it was negatively impacted by {', '.join(neg_names)}."
        )
    elif positive_features:
        pos_names = [f["feature_name"] for f in positive_features[:3]]
        summary = f"This lead is highly qualified, driven strongly by {', '.join(pos_names)}."
    elif negative_features:
        neg_names = [f["feature_name"] for f in negative_features[:3]]
        summary = f"This lead scored lower due to poor indicators from {', '.join(neg_names)}."
    else:
        summary = "This lead has a neutral profile with minimal significant predictive outliers."

    return {
        "lead_id": lead_id,
        "summary": summary,
        "positive_features": positive_features,
        "negative_features": negative_features
    }
