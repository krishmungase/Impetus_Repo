import os
import kaggle
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def download_model():
    """
    Downloads the brain tumor model from Kaggle if it doesn't exist locally.
    Returns the path to the model file.
    """
    model_path = 'brain_tumor_mri.keras'
    
    # If model doesn't exist locally, download it
    if not os.path.exists(model_path):
        print("Downloading model from Kaggle...")
        
        # Configure Kaggle credentials
        kaggle_username = os.getenv('KAGGLE_USERNAME')
        kaggle_key = os.getenv('KAGGLE_KEY')
        
        if not kaggle_username or not kaggle_key:
            raise ValueError("Kaggle credentials not found. Please set KAGGLE_USERNAME and KAGGLE_KEY in your .env file")
            
        os.environ['KAGGLE_USERNAME'] = kaggle_username
        os.environ['KAGGLE_KEY'] = kaggle_key
        
        try:
            # Download the model from Kaggle
            kaggle.api.authenticate()
            kaggle.api.dataset_download_files(
                'esfiam/cnn-brain-tumor-detector',
                path='.',
                unzip=True
            )
            print("Model downloaded successfully!")
        except Exception as e:
            print(f"Error downloading model: {str(e)}")
            raise
    
    return model_path 