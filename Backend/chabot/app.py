from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import logging
from utils import run_ollama_model, get_medical_system_prompt
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, 
    template_folder='templates',
    static_folder='static'
)
CORS(app)

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('static', path)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat API requests"""
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'response': 'Please enter a message.'}), 400
        
        # Get response from Ollama model with medical system prompt
        system_prompt = get_medical_system_prompt()
        response = run_ollama_model(user_message, system_prompt)
        
        return jsonify({'response': response})
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({'response': 'An error occurred processing your request.'}), 500

if __name__ == '__main__':
    # Create necessary directories if they don't exist
    os.makedirs('static', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    logger.info("🏥 Medical Assistant Chatbot")
    logger.info("----------------------------")
    logger.info("Server running at http://localhost:8080")
    app.run(host='0.0.0.0', port=8080, debug=True)