import os
import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

DATA_PATH = "../data/raw/bank-additional-full.csv"
MODEL_DIR = "trained_models"

# -----------------------------
# 1. Load dataset
# -----------------------------
df = pd.read_csv(DATA_PATH, sep=";")

# -----------------------------
# 2. Remove leakage column
# -----------------------------
if "duration" in df.columns:
    df = df.drop(columns=["duration"])

# -----------------------------
# 3. Split features and target
# -----------------------------
X = df.drop(columns=["y"])
y = df["y"].map({"no": 0, "yes": 1})

# -----------------------------
# 4. Identify column types
# -----------------------------
categorical_cols = X.select_dtypes(include=["object", "string"]).columns.tolist()
numeric_cols = X.select_dtypes(exclude=["object", "string"]).columns.tolist()

print("Categorical columns:", categorical_cols)
print("Numeric columns:", numeric_cols)

# -----------------------------
# 5. Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -----------------------------
# 6. Preprocessing
# -----------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
        ("num", "passthrough", numeric_cols)
    ]
)

# -----------------------------
# 7. Model
# -----------------------------
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_split=10,
    min_samples_leaf=4,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

# -----------------------------
# 8. Full pipeline
# -----------------------------
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", model)
])

# -----------------------------
# 9. Train
# -----------------------------
print("\nTraining model...")
pipeline.fit(X_train, y_train)

# -----------------------------
# 10. Predict
# -----------------------------
y_pred = pipeline.predict(X_test)
y_prob = pipeline.predict_proba(X_test)[:, 1]

# -----------------------------
# 11. Evaluate
# -----------------------------
print("\nModel Evaluation:")
print("Accuracy :", round(accuracy_score(y_test, y_pred), 4))
print("Precision:", round(precision_score(y_test, y_pred), 4))
print("Recall   :", round(recall_score(y_test, y_pred), 4))
print("F1 Score :", round(f1_score(y_test, y_pred), 4))
print("ROC AUC  :", round(roc_auc_score(y_test, y_prob), 4))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# -----------------------------
# 12. Save model
# -----------------------------
os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(pipeline, os.path.join(MODEL_DIR, "bank_lead_model.pkl"))
joblib.dump(categorical_cols, os.path.join(MODEL_DIR, "categorical_cols.pkl"))
joblib.dump(numeric_cols, os.path.join(MODEL_DIR, "numeric_cols.pkl"))

print(f"\nModel saved successfully in: {MODEL_DIR}/")