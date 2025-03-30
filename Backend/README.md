# AI Healthcare Backend

This is the backend service for the AI Healthcare platform, providing various healthcare-related AI functionalities.

## Project Structure

```
Backend/
├── ai_healthcare/              # Main AI healthcare application
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── models/               # AI model files
│   │   ├── brain_tumor_model.h5
│   │   └── disease_prediction_model.h5
│   └── static/               # Static files
│       └── uploads/          # Uploaded files storage
└── medicine-recommendation-system-dataset/  # Dataset for medicine recommendations
```

## Features

- MRI Scan Analysis
- Disease Prediction
- Medicine Recommendation System
- File Upload and Processing
- RESTful API Endpoints

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd Backend/ai_healthcare
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### MRI Analysis
- `POST /api/predict`: Upload and analyze MRI scans
  - Accepts: Multipart form data with MRI image
  - Returns: JSON with prediction results

### Disease Prediction
- `POST /api/predict-disease`: Predict diseases based on symptoms
  - Accepts: JSON with patient symptoms
  - Returns: JSON with prediction results

### Medicine Recommendation
- `POST /api/recommend-medicine`: Get medicine recommendations
  - Accepts: JSON with disease information
  - Returns: JSON with recommended medicines

## Environment Variables

Create a `.env` file in the `ai_healthcare` directory with the following variables:
```
FLASK_APP=app.py
FLASK_ENV=development
UPLOAD_FOLDER=static/uploads
MAX_CONTENT_LENGTH=16777216  # 16MB max file size
```

## Dependencies

- Flask==2.0.1
- TensorFlow==2.8.0
- NumPy==1.21.2
- Pillow==8.3.2
- python-dotenv==0.19.0
- flask-cors==3.0.10

## Notes

- The application requires Python 3.8 or higher
- Make sure to have sufficient disk space for model files
- The uploads directory is automatically created if it doesn't exist
- CORS is enabled for frontend integration 