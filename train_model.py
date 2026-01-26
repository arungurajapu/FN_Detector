import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline
import joblib

# Load data
# Ensure you have the 'FakeNewsNet.csv' file in the same directory
df = pd.read_csv('FakeNewsNet.csv')
df = df.dropna(subset=['title', 'real']) # Drop rows where title or real is NaN

# Define features (X) and labels (y)
X = df['title']
y = df['real']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Create the TF-IDF Vectorizer with optimized parameters
vectorizer = TfidfVectorizer(
    max_features=10000,
    ngram_range=(1, 2),
    min_df=5,
    stop_words='english'
)

# Create the Logistic Regression model
# This model is often a strong performer on text classification tasks
model = LogisticRegression(
    C=5,                # A strong regularization parameter
    class_weight='balanced', # Handles imbalanced data
    solver='liblinear', # Good solver for this type of problem
    random_state=42
)

# Create a processing pipeline
# This chains the vectorizer and the classifier together
pipeline = Pipeline([
    ('vectorizer', vectorizer),
    ('classifier', model)
])

# Train the model
pipeline.fit(X_train, y_train)

# Evaluate the model
y_pred = pipeline.predict(X_test)
print("Model Evaluation Results:")
print("="*25)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save the trained model pipeline
joblib.dump(pipeline, 'model.pkl')
print("\nNew, more accurate model saved as model.pkl")