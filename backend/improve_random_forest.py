import os
import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_validate
)
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

DATA_PATH = "../data/raw/bank-additional-full.csv"
MODEL_DIR = "trained_models"
os.makedirs(MODEL_DIR, exist_ok=True)


def add_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["was_contacted_before"] = (df["previous"] > 0).astype(int)
    df["never_contacted_before"] = (df["pdays"] == 999).astype(int)
    df["previously_successful"] = (df["poutcome"] == "success").astype(int)
    df["has_any_loan"] = ((df["housing"] == "yes") | (df["loan"] == "yes")).astype(int)
    df["is_married"] = (df["marital"] == "married").astype(int)
    df["is_weekday_mon_thu"] = df["day_of_week"].isin(["mon", "tue", "wed", "thu"]).astype(int)

    return df


def build_pipeline(categorical_cols, numeric_cols):
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
            ("num", "passthrough", numeric_cols)
        ]
    )

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("model", RandomForestClassifier(
            n_estimators=200,
            max_depth=14,
            min_samples_split=5,
            min_samples_leaf=4,
            max_features="sqrt",
            class_weight="balanced",
            random_state=42,
            n_jobs=-1
        ))
    ])

    return pipeline


# 1. Load and prepare data
df = pd.read_csv(DATA_PATH, sep=";")

if "duration" in df.columns:
    df = df.drop(columns=["duration"])

df = add_engineered_features(df)

X = df.drop(columns=["y"])
y = df["y"].map({"no": 0, "yes": 1})

categorical_cols = X.select_dtypes(include=["object", "string"]).columns.tolist()
numeric_cols = X.select_dtypes(exclude=["object", "string"]).columns.tolist()

# 2. Holdout test split
X_train_full, X_test, y_train_full, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 3. Cross-validation on training data only
cv_pipeline = build_pipeline(categorical_cols, numeric_cols)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scoring = {
    "accuracy": "accuracy",
    "precision": "precision",
    "recall": "recall",
    "f1": "f1",
    "roc_auc": "roc_auc"
}

print("Running 5-fold cross-validation on improved model...")

cv_scores = cross_validate(
    cv_pipeline,
    X_train_full,
    y_train_full,
    cv=cv,
    scoring=scoring,
    n_jobs=-1,
    return_train_score=False
)

cv_summary = []
for metric_name in scoring.keys():
    metric_values = cv_scores[f"test_{metric_name}"]
    cv_summary.append({
        "metric": metric_name,
        "mean": round(metric_values.mean(), 4),
        "std": round(metric_values.std(), 4)
    })

cv_df = pd.DataFrame(cv_summary)

print("\nCross-Validation Summary:")
for _, row in cv_df.iterrows():
    print(f"{row['metric'].upper():<10} Mean: {row['mean']:.4f} | Std: {row['std']:.4f}")

# 4. Train/validation split for threshold selection
X_train, X_val, y_train, y_val = train_test_split(
    X_train_full,
    y_train_full,
    test_size=0.2,
    random_state=42,
    stratify=y_train_full
)

pipeline = build_pipeline(categorical_cols, numeric_cols)

print("\nTraining improved Random Forest...")
pipeline.fit(X_train, y_train)

# 5. Threshold search on validation set
val_probs = pipeline.predict_proba(X_val)[:, 1]
threshold_results = []

for threshold in np.arange(0.40, 0.91, 0.05):
    val_preds = (val_probs >= threshold).astype(int)

    threshold_results.append({
        "threshold": round(float(threshold), 2),
        "accuracy": accuracy_score(y_val, val_preds),
        "precision": precision_score(y_val, val_preds, zero_division=0),
        "recall": recall_score(y_val, val_preds, zero_division=0),
        "f1": f1_score(y_val, val_preds, zero_division=0),
        "predicted_positives": int(val_preds.sum())
    })

threshold_df = pd.DataFrame(threshold_results)

best_f1_row = threshold_df.loc[threshold_df["f1"].idxmax()]
best_precision_row = threshold_df.loc[threshold_df["precision"].idxmax()]

candidate_rows = threshold_df[threshold_df["recall"] >= 0.40]
if not candidate_rows.empty:
    best_business_row = candidate_rows.loc[candidate_rows["precision"].idxmax()]
else:
    best_business_row = best_f1_row

chosen_threshold = float(best_business_row["threshold"])

print("\nSelected Threshold Summary:")
print(f"Best F1 Threshold        : {best_f1_row['threshold']:.2f}")
print(f"Best Precision Threshold : {best_precision_row['threshold']:.2f}")
print(f"Chosen Business Threshold: {chosen_threshold:.2f}")

# 6. Retrain on full training data before final test
final_pipeline = build_pipeline(categorical_cols, numeric_cols)
final_pipeline.fit(X_train_full, y_train_full)

# 7. Final test evaluation
test_probs = final_pipeline.predict_proba(X_test)[:, 1]
test_preds = (test_probs >= chosen_threshold).astype(int)

accuracy = accuracy_score(y_test, test_preds)
precision = precision_score(y_test, test_preds)
recall = recall_score(y_test, test_preds)
f1 = f1_score(y_test, test_preds)
roc_auc = roc_auc_score(y_test, test_probs)

print("\nFinal Test Metrics:")
print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")
print(f"ROC AUC  : {roc_auc:.4f}")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, test_preds))

# 8. Save artifacts
joblib.dump(final_pipeline, os.path.join(MODEL_DIR, "improved_random_forest_pipeline.pkl"))
joblib.dump(chosen_threshold, os.path.join(MODEL_DIR, "improved_random_forest_threshold.pkl"))
threshold_df.to_csv(os.path.join(MODEL_DIR, "threshold_analysis_rf.csv"), index=False)
cv_df.to_csv(os.path.join(MODEL_DIR, "cv_results_improved_rf.csv"), index=False)

results_df = X_test.copy()
results_df["actual"] = y_test.values
results_df["predicted"] = test_preds
results_df["propensity_score"] = test_probs
results_df = results_df.sort_values(by="propensity_score", ascending=False)
results_df.to_csv(os.path.join(MODEL_DIR, "sample_scored_leads_rf_improved.csv"), index=False)

print(f"\nSaved improved model artifacts in: {MODEL_DIR}/")