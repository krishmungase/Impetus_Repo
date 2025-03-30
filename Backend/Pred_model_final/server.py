from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import joblib
import pandas as pd
import numpy as np

# Load the trained models
rf_model = joblib.load("rf_model.pkl")
svc_model = joblib.load("svc.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# Load additional datasets
description = pd.read_csv("description.csv")
precautions = pd.read_csv("precautions_df.csv")
medications = pd.read_csv("medications.csv")
diets = pd.read_csv("diets.csv")
workout = pd.read_csv("workout_df.csv")

# Flask app
app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

def get_disease_info(disease):
    desc = description[description['Disease'] == disease]['Description'].values
    pre = precautions[precautions['Disease'] == disease][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']].values.flatten()
    med = medications[medications['Disease'] == disease]['Medication'].values
    diet = diets[diets['Disease'] == disease]['Diet'].values
    wrk = workout[workout['disease'] == disease]['workout'].values
    
    return {
        "description": desc[0] if len(desc) > 0 else "Not available",
        "precautions": list(pre[~pd.isna(pre)]) if len(pre) > 0 else [],
        "medications": list(med) if len(med) > 0 else [],
        "diets": list(diet) if len(diet) > 0 else [],
        "workout": list(wrk) if len(wrk) > 0 else []
    }

# API Route for disease prediction
@app.route('/predict', methods=['POST'])
def predict_disease():
    data = request.json
    symptoms = data.get("symptoms", [])
    model_type = data.get("model_type", "rf")  # Default to Random Forest
    
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400
    
    # Select the model
    model = rf_model if model_type == "rf" else svc_model
    
    # Convert symptoms to feature vector
    input_vector = np.zeros(len(model.feature_names_in_))
    for symptom in symptoms:
        if symptom in model.feature_names_in_:
            input_vector[model.feature_names_in_.tolist().index(symptom)] = 1
    
    input_vector = input_vector.reshape(1, -1)
    probabilities = model.predict_proba(input_vector)[0]
    top_disease_indices = np.argsort(probabilities)[-3:][::-1]  # Get top 3 diseases
    
    diseases = []
    probabilities_list = []
    general_details = {"description": [], "diets": [], "medications": [], "precautions": [], "workout": []}

    for idx in top_disease_indices:
        disease_name = label_encoder.inverse_transform([idx])[0]
        disease_info = get_disease_info(disease_name)

        diseases.append(disease_name)
        probabilities_list.append(round(probabilities[idx] * 100, 2))

        # Aggregate details (avoid duplicates)
        if disease_info["description"] not in general_details["description"]:
            general_details["description"].append(disease_info["description"])
        general_details["diets"].extend(disease_info["diets"])
        general_details["medications"].extend(disease_info["medications"])
        general_details["precautions"].extend(disease_info["precautions"])
        general_details["workout"].extend(disease_info["workout"])

    # Remove duplicates in lists
    for key in general_details:
        general_details[key] = list(set(general_details[key]))  

    return jsonify({
        "model_used": "Random Forest" if model_type == "rf" else "SVC",
        "predictions": {
            "diseases": diseases,
            "probabilities": probabilities_list,
            "general_details": general_details
        }
    })

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
