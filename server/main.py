from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS, cross_origin
# from feature_extraction.feature_extractor import extract_url_features
app = Flask(__name__)
import joblib
import numpy as np

# Load the data from the pkl file
try:
    with open('phishing.pkl', 'rb') as f:
        data = pickle.load(f)
except FileNotFoundError:
    data = None
cors = CORS(app)

@app.route('/predict', methods=['POST'])
def process_url():

    # classifier = joblib.load('trained_models/model.pkl')
    data = "hi"
    

    processed_result = {
        "message": "Sumarize successfully",
        "data": data,
    }
    
    return jsonify(processed_result)


if __name__ == '__main__':
    app.run(debug=True)
