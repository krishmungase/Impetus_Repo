from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_tumor(image_path):
    # Load the model
    model = load_model('brain_tumor_mri.keras')
    
    # Load and preprocess the image
    img = load_img(image_path, target_size=(256, 256), color_mode='grayscale')
    img_array = img_to_array(img)
    
    # Normalize and prepare input
    img_normalized = img_array / 255.0
    img_normalized = np.expand_dims(img_normalized, axis=0)
    
    # Make prediction
    predictions = model.predict(img_normalized)
    classes = ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor']
    
    # Get prediction results
    predicted_class = classes[np.argmax(predictions[0])]
    confidence_scores = {
        class_name: float(prob) * 100 
        for class_name, prob in zip(classes, predictions[0])
    }
    
    return predicted_class, confidence_scores

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Make prediction
            predicted_class, confidence_scores = predict_tumor(filepath)
            
            # Get the host from the request
            host = request.host_url.rstrip('/')
            image_url = f"{host}/static/uploads/{filename}"
            
            return jsonify({
                'success': True,
                'prediction': predicted_class,
                'confidence_scores': confidence_scores,
                'image_url': image_url
            })
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

# Route to serve static files
@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5001) 
