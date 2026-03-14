import pandas as pd

DATA_PATH = "../data/raw/bank-additional-full.csv"

df = pd.read_csv(DATA_PATH, sep=";")

print("Shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())

print("\nData types:")
print(df.dtypes)

print("\nFirst 5 rows:")
print(df.head())

print("\nMissing values:")
print(df.isnull().sum())

print("\nTarget distribution:")
print(df["y"].value_counts())
print(df["y"].value_counts(normalize=True))

categorical_cols = df.select_dtypes(include=["object", "string"]).columns.tolist()
numeric_cols = df.select_dtypes(exclude=["object", "string"]).columns.tolist()

print("\nCategorical columns:")
print(categorical_cols)

print("\nNumeric columns:")
print(numeric_cols)