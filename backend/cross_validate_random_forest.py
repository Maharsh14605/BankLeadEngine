import pandas as pd
import numpy as np

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate

DATA_PATH = "../data/raw/bank-additional-full.csv"

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
# 2. Holdout test split
# -----------------------------
X_train_full, X_test, y_train_full, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -----------------------------
# 3. Preprocessing
# -----------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
        ("num", "passthrough", numeric_cols)
    ]
)

# -----------------------------
# 4. Tuned Random Forest model
# -----------------------------
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=14,
    min_samples_split=5,
    min_samples_leaf=4,
    max_features="sqrt",
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", model)
])

# -----------------------------
# 5. Stratified 5-fold CV
# -----------------------------
cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)

scoring = {
    "accuracy": "accuracy",
    "precision": "precision",
    "recall": "recall",
    "f1": "f1",
    "roc_auc": "roc_auc"
}

scores = cross_validate(
    pipeline,
    X_train_full,
    y_train_full,
    cv=cv,
    scoring=scoring,
    n_jobs=-1,
    return_train_score=False
)

# -----------------------------
# 6. Print results
# -----------------------------
print("Cross-Validation Results (5-Fold):\n")

for metric_name in scoring.keys():
    metric_scores = scores[f"test_{metric_name}"]
    print(f"{metric_name.upper()} scores: {np.round(metric_scores, 4)}")
    print(f"Mean {metric_name.upper()}: {metric_scores.mean():.4f}")
    print(f"Std  {metric_name.upper()}: {metric_scores.std():.4f}\n")