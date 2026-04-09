import joblib
import pandas as pd

MODEL_PATH = "trained_models/improved_random_forest_pipeline.pkl"
THRESHOLD_PATH = "trained_models/improved_random_forest_threshold.pkl"

pipeline = joblib.load(MODEL_PATH)
threshold = joblib.load(THRESHOLD_PATH)


def add_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["was_contacted_before"] = (df["previous"] > 0).astype(int)
    df["never_contacted_before"] = (df["pdays"] == 999).astype(int)
    df["previously_successful"] = (df["poutcome"] == "success").astype(int)
    df["has_any_loan"] = ((df["housing"] == "yes") | (df["loan"] == "yes")).astype(int)
    df["is_married"] = (df["marital"] == "married").astype(int)
    df["is_weekday_mon_thu"] = df["day_of_week"].isin(["mon", "tue", "wed", "thu"]).astype(int)

    return df


def get_priority_band(score: float) -> str:
    if score >= 0.85:
        return "High"
    elif score >= threshold:
        return "Medium"
    return "Low"


def score_lead(lead_data: dict) -> dict:
    df = pd.DataFrame([lead_data])
    df = add_engineered_features(df)

    propensity_score = float(pipeline.predict_proba(df)[0][1])
    predicted_label = int(propensity_score >= threshold)
    priority_band = get_priority_band(propensity_score)

    return {
        "propensity_score": propensity_score,
        "predicted_label": predicted_label,
        "priority_band": priority_band,
        "threshold_used": float(threshold)
    }