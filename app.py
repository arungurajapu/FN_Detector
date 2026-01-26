from flask import Flask, request, jsonify, render_template
import joblib
import os
from datetime import datetime

# Create Flask app for local development
app = Flask(__name__, static_folder='static')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Load the model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
model = joblib.load(model_path)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get text from JSON (for API calls from your script.js)
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Make prediction
    prediction = model.predict([text])[0]
    result = "FAKE" if prediction == 0 else "REAL"
    
    # Return JSON for the frontend to process
    return jsonify({
        "prediction": result,
        "confidence": "N/A"  # Placeholder for now
    })

# Run the app locally
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)