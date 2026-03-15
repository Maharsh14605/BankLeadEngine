import os
import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, ParameterGrid
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

DATA_PATH = "../data/raw/bank-additional-full.csv"
MODEL_DIR = "trained_models"

# -----------------------------
# 1. Load data
# -----------------------------
df = pd.read_csv(DATA_PATH, sep=";")

# Remove leakage column
if "duration" in df.columns:
    df = df.drop(columns=["duration"])

X = df.drop(columns=["y"])
y = df["y"].map({"no": 0, "yes": 1})

categorical_cols = X.select_dtypes(include=["object", "string"]).columns.tolist()
numeric_cols = X.select_dtypes(exclude=["object", "string"]).columns.tolist()

# -----------------------------
# 2. Split data
# -----------------------------
X_train_full, X_test, y_train_full, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

X_train, X_val, y_train, y_val = train_test_split(
    X_train_full,
    y_train_full,
    test_size=0.2,
    random_state=42,
    stratify=y_train_full
)

# -----------------------------
# 3. Preprocessor
# -----------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
        ("num", "passthrough", numeric_cols)
    ]
)

# -----------------------------
# 4. Parameter grid
# -----------------------------
param_grid = {
    "n_estimators": [200, 300],
    "max_depth": [10, 14, 18],
    "min_samples_split": [5, 10],
    "min_samples_leaf": [2, 4],
    "max_features": ["sqrt", "log2"]
}

best_pipeline = None
best_params = None
best_val_auc = -1

# -----------------------------
# 5. Grid search
# -----------------------------
for params in ParameterGrid(param_grid):
    model = RandomForestClassifier(
        n_estimators=params["n_estimators"],
        max_depth=params["max_depth"],
        min_samples_split=params["min_samples_split"],
        min_samples_leaf=params["min_samples_leaf"],
        max_features=params["max_features"],
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    pipeline.fit(X_train, y_train)
    val_probs = pipeline.predict_proba(X_val)[:, 1]
    val_auc = roc_auc_score(y_val, val_probs)

    print(f"Params: {params} -> Validation ROC AUC: {val_auc:.4f}")

    if val_auc > best_val_auc:
        best_val_auc = val_auc
        best_pipeline = pipeline
        best_params = params

print("\nBest Parameters:")
print(best_params)
print("Best Validation ROC AUC:", round(best_val_auc, 4))

# -----------------------------
# 6. Threshold tuning on validation set
# -----------------------------
val_probs = best_pipeline.predict_proba(X_val)[:, 1]

best_threshold = 0.50
best_f1 = 0.0

for threshold in np.arange(0.20, 0.81, 0.01):
    val_preds = (val_probs >= threshold).astype(int)
    score = f1_score(y_val, val_preds)
    if score > best_f1:
        best_f1 = score
        best_threshold = threshold

print("\nBest Threshold:", round(best_threshold, 2))
print("Best Validation F1:", round(best_f1, 4))

# -----------------------------
# 7. Evaluate on test set
# -----------------------------
test_probs = best_pipeline.predict_proba(X_test)[:, 1]
test_preds = (test_probs >= best_threshold).astype(int)

print("\nTuned Random Forest Test Evaluation:")
print("Accuracy :", round(accuracy_score(y_test, test_preds), 4))
print("Precision:", round(precision_score(y_test, test_preds), 4))
print("Recall   :", round(recall_score(y_test, test_preds), 4))
print("F1 Score :", round(f1_score(y_test, test_preds), 4))
print("ROC AUC  :", round(roc_auc_score(y_test, test_probs), 4))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, test_preds))

print("\nClassification Report:")
print(classification_report(y_test, test_preds))

# -----------------------------
# 8. Save artifacts
# -----------------------------
os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(best_pipeline, os.path.join(MODEL_DIR, "best_random_forest_pipeline.pkl"))
joblib.dump(best_threshold, os.path.join(MODEL_DIR, "best_random_forest_threshold.pkl"))
joblib.dump(best_params, os.path.join(MODEL_DIR, "best_random_forest_params.pkl"))

results_df = X_test.copy()
results_df["actual"] = y_test.values
results_df["predicted"] = test_preds
results_df["propensity_score"] = test_probs
results_df = results_df.sort_values(by="propensity_score", ascending=False)
results_df.to_csv(os.path.join(MODEL_DIR, "sample_scored_leads_rf_tuned.csv"), index=False)

print(f"\nSaved tuned model artifacts in: {MODEL_DIR}/")