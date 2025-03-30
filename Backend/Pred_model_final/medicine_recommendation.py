import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import warnings
warnings.filterwarnings('ignore')

# Load the data
df = pd.read_csv('Training.csv')
sym_des = pd.read_csv('symtoms_df.csv')
precautions = pd.read_csv('precautions_df.csv')
workout = pd.read_csv('workout_df.csv')
description = pd.read_csv('description.csv')
medications = pd.read_csv('medications.csv')
diets = pd.read_csv('diets.csv')

# Prepare the data
X = df.drop('prognosis', axis=1)
y = df['prognosis']

# Label encode the target
le = LabelEncoder()
le.fit(y)
Y = le.transform(y)

# Train the model
rf_model = RandomForestClassifier(random_state=42, n_estimators=100)
rf_model.fit(X, Y)

# Save the model
with open('rf_model.pkl', 'wb') as file:
    pickle.dump(rf_model, file)

# Save the label encoder
with open('label_encoder.pkl', 'wb') as file:
    pickle.dump(le, file)

# Symptoms dictionary
symptoms_dict = {'itching': 0, 'skin_rash': 1, 'nodal_skin_eruptions': 2, 'continuous_sneezing': 3, 
                'shivering': 4, 'chills': 5, 'joint_pain': 6, 'stomach_pain': 7, 'acidity': 8, 
                'ulcers_on_tongue': 9, 'muscle_wasting': 10, 'vomiting': 11, 'burning_micturition': 12, 
                'spotting_ urination': 13, 'fatigue': 14, 'weight_gain': 15, 'anxiety': 16, 
                'cold_hands_and_feets': 17, 'mood_swings': 18, 'weight_loss': 19, 'restlessness': 20, 
                'lethargy': 21, 'patches_in_throat': 22, 'irregular_sugar_level': 23, 'cough': 24, 
                'high_fever': 25, 'sunken_eyes': 26, 'breathlessness': 27, 'sweating': 28, 
                'dehydration': 29, 'indigestion': 30, 'headache': 31, 'yellowish_skin': 32, 
                'dark_urine': 33, 'nausea': 34, 'loss_of_appetite': 35, 'pain_behind_the_eyes': 36, 
                'back_pain': 37, 'constipation': 38, 'abdominal_pain': 39, 'diarrhoea': 40, 
                'mild_fever': 41, 'yellow_urine': 42, 'yellowing_of_eyes': 43, 'acute_liver_failure': 44, 
                'fluid_overload': 45, 'swelling_of_stomach': 46, 'swelled_lymph_nodes': 47, 'malaise': 48, 
                'blurred_and_distorted_vision': 49, 'phlegm': 50, 'throat_irritation': 51, 
                'redness_of_eyes': 52, 'sinus_pressure': 53, 'runny_nose': 54, 'congestion': 55, 
                'chest_pain': 56, 'weakness_in_limbs': 57, 'fast_heart_rate': 58, 
                'pain_during_bowel_movements': 59, 'pain_in_anal_region': 60, 'bloody_stool': 61, 
                'irritation_in_anus': 62, 'neck_pain': 63, 'dizziness': 64, 'cramps': 65, 'bruising': 66, 
                'obesity': 67, 'swollen_legs': 68, 'swollen_blood_vessels': 69, 'puffy_face_and_eyes': 70, 
                'enlarged_thyroid': 71, 'brittle_nails': 72, 'swollen_extremeties': 73, 
                'excessive_hunger': 74, 'extra_marital_contacts': 75, 'drying_and_tingling_lips': 76, 
                'slurred_speech': 77, 'knee_pain': 78, 'hip_joint_pain': 79, 'muscle_weakness': 80, 
                'stiff_neck': 81, 'swelling_joints': 82, 'movement_stiffness': 83, 'spinning_movements': 84, 
                'loss_of_balance': 85, 'unsteadiness': 86, 'weakness_of_one_body_side': 87, 
                'loss_of_smell': 88, 'bladder_discomfort': 89, 'foul_smell_of urine': 90, 
                'continuous_feel_of_urine': 91, 'passage_of_gases': 92, 'internal_itching': 93, 
                'toxic_look_(typhos)': 94, 'depression': 95, 'irritability': 96, 'muscle_pain': 97, 
                'altered_sensorium': 98, 'red_spots_over_body': 99, 'belly_pain': 100, 
                'abnormal_menstruation': 101, 'dischromic _patches': 102, 'watering_from_eyes': 103, 
                'increased_appetite': 104, 'polyuria': 105, 'family_history': 106, 'mucoid_sputum': 107, 
                'rusty_sputum': 108, 'lack_of_concentration': 109, 'visual_disturbances': 110, 
                'receiving_blood_transfusion': 111, 'receiving_unsterile_injections': 112, 'coma': 113, 
                'stomach_bleeding': 114, 'distention_of_abdomen': 115, 'history_of_alcohol_consumption': 116, 
                'fluid_overload.1': 117, 'blood_in_sputum': 118, 'prominent_veins_on_calf': 119, 
                'palpitations': 120, 'painful_walking': 121, 'pus_filled_pimples': 122, 'blackheads': 123, 
                'scurring': 124, 'skin_peeling': 125, 'silver_like_dusting': 126, 'small_dents_in_nails': 127, 
                'inflammatory_nails': 128, 'blister': 129, 'red_sore_around_nose': 130, 'yellow_crust_ooze': 131}

def helper(dis):
    desc = description[description['Disease'] == dis]['Description']
    desc = " ".join([w for w in desc])

    pre = precautions[precautions['Disease'] == dis][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']]
    pre = [col for col in pre.values]

    med = medications[medications['Disease'] == dis]['Medication']
    med = [med for med in med.values]

    die = diets[diets['Disease'] == dis]['Diet']
    die = [die for die in die.values]

    wrkout = workout[workout['disease'] == dis]['workout']

    return desc, pre, med, die, wrkout

def get_disease_probabilities(patient_symptoms):
    # Convert input symptoms to set for faster lookup
    patient_symptom_set = set(patient_symptoms)
    
    # Initialize dictionary to store disease scores
    disease_scores = {}
    
    # Common conditions that should be considered first
    common_conditions = {
        'Common Cold', 'Bronchial Asthma', 'Pneumonia', 'Migraine', 
        'Hypertension', 'Diabetes', 'Gastroenteritis', 'Acidity',
        'Urinary tract infection', 'Allergy'
    }
    
    # For each row in the training data
    for idx, row in df.iterrows():
        disease = row['prognosis']
        # Get all symptoms that are 1 for this disease
        disease_symptoms = set([col for col in df.columns if col != 'prognosis' and row[col] == 1])
        
        # Calculate overlap between patient symptoms and disease symptoms
        overlap = len(patient_symptom_set.intersection(disease_symptoms))
        total_disease_symptoms = len(disease_symptoms)
        
        if total_disease_symptoms > 0:
            # Base score on symptom overlap
            base_score = (overlap / total_disease_symptoms) * 100
            
            # Adjust score based on whether it's a common condition
            if disease in common_conditions:
                base_score *= 1.5  # Boost score for common conditions
            
            # Additional boost if all patient symptoms match
            if overlap == len(patient_symptom_set):
                base_score *= 1.2
            
            # Penalize severe conditions unless they have very high symptom match
            if disease not in common_conditions and base_score < 80:
                base_score *= 0.7
            
            if disease not in disease_scores or base_score > disease_scores[disease]:
                disease_scores[disease] = base_score
    
    # Sort diseases by score and get top 5
    sorted_diseases = sorted(disease_scores.items(), key=lambda x: x[1], reverse=True)[:5]
    
    # Convert to list of dictionaries
    predictions = [{'disease': disease, 'probability': round(score, 2)} 
                  for disease, score in sorted_diseases]
    
    return predictions

def get_accurate_disease_predictions(patient_symptoms):
    # Convert input symptoms to set for faster lookup
    patient_symptom_set = set(patient_symptoms)
    
    # Initialize dictionary to store disease scores
    disease_scores = {}
    
    # Check for chicken pox specifically
    if 'itchy rash' in patient_symptom_set and 'blisters' in patient_symptom_set:
        disease_scores['Chicken Pox'] = 100  # Directly assign a high score for chicken pox
    
    # For each row in the training data
    for idx, row in df.iterrows():
        disease = row['prognosis']
        disease_symptoms = set([col for col in df.columns if col != 'prognosis' and row[col] == 1])
        
        # Calculate overlap between patient symptoms and disease symptoms
        overlap = len(patient_symptom_set.intersection(disease_symptoms))
        total_disease_symptoms = len(disease_symptoms)
        
        if total_disease_symptoms > 0:
            # Calculate score based on symptom overlap
            score = (overlap / total_disease_symptoms) * 100
            
            if disease not in disease_scores or score > disease_scores[disease]:
                disease_scores[disease] = score
    
    # Sort diseases by score and get top 5
    sorted_diseases = sorted(disease_scores.items(), key=lambda x: x[1], reverse=True)[:5]
    
    # Convert to list of dictionaries
    predictions = [{'disease': disease, 'probability': round(score, 2)} 
                  for disease, score in sorted_diseases]
    
    return predictions

def predict_diseases(symptoms):
    user_symptoms = [s.strip() for s in symptoms.split(',')]
    user_symptoms = [symptom.strip("[]' ") for symptom in user_symptoms]
    
    # Get predictions based on symptom overlap
    predictions = get_disease_probabilities(user_symptoms)
    
    # First show all predicted diseases
    print("\n=================Possible Conditions (based on symptom match)============")
    for i, pred in enumerate(predictions, 1):
        print(f"{i}. {pred['disease']} (Symptom Match: {pred['probability']}%)")
    
    print("\n" + "="*50)
    
    # Collect all information from all diseases
    all_precautions = []
    all_medications = []
    all_diets = []
    all_workouts = []
    
    for pred in predictions:
        disease = pred['disease']
        desc, pre, med, die, wrkout = helper(disease)
        
        # Add precautions
        if pre and len(pre) > 0:
            for p in pre[0]:
                if isinstance(p, str) and p not in all_precautions and p.strip():
                    all_precautions.append(p)
        
        # Add medications
        if med:
            for m in med:
                if isinstance(m, str) and m not in all_medications and m:
                    all_medications.append(m)
        
        # Add diets
        if die:
            for d in die:
                if isinstance(d, str) and d not in all_diets and d:
                    all_diets.append(d)
        
        # Add workouts
        if wrkout.any():
            for w in wrkout:
                if isinstance(w, str) and w not in all_workouts and w.strip():
                    all_workouts.append(w)
    
    # Print all precautions
    print("\n=================Recommended Precautions==================")
    for i, p in enumerate(all_precautions, 1):
        print(f"{i}. {p}")
    
    # Print all medications
    print("\n=================Recommended Medications==================")
    for i, m in enumerate(all_medications, 1):
        print(f"{i}. {m}")
    
    # Print all diets
    print("\n=================Recommended Diet==================")
    for i, d in enumerate(all_diets, 1):
        print(f"{i}. {d}")
    
    # Print all workouts
    print("\n=================Recommended Workouts==================")
    for i, w in enumerate(all_workouts, 1):
        print(f"{i}. {w}")
    
    print("\n" + "="*50)
    print("\nNote: This is a preliminary assessment based on symptom matching. Please consult a healthcare professional for accurate diagnosis and treatment.")

if __name__ == "__main__":
    symptoms = input("Enter your symptoms (comma-separated).......")
    predict_diseases(symptoms) 