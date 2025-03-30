import json
import logging
import re
from ollama import Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the model name
MODEL_NAME = "llama2-uncensored"

# Initialize Ollama client
client = Client(host='http://localhost:11434')

def is_medical_query(query):
    """
    Determine if a query is medical-related.
    
    Args:
        query (str): The user's query
        
    Returns:
        bool: True if the query is medical-related, False otherwise
    """
    # List of medical-related keywords and patterns
    medical_keywords = {
        # Medications and Treatments
        'medicine', 'drug', 'tablet', 'capsule', 'syrup', 'injection', 'prescription',
        'dose', 'dosage', 'treatment', 'therapy', 'medication', 'cure', 'vaccine',
        'antibiotic', 'painkiller', 'inhaler', 'ointment', 'drops',
        
        # Common Medications
        'crocin', 'paracetamol', 'aspirin', 'ibuprofen', 'acetaminophen',
        'amoxicillin', 'omeprazole', 'metformin',
        
        # Symptoms and Conditions
        'pain', 'ache', 'fever', 'cough', 'cold', 'flu', 'infection',
        'disease', 'condition', 'disorder', 'syndrome', 'inflammation',
        'swelling', 'rash', 'allergy', 'diabetes', 'asthma', 'arthritis',
        'migraine', 'diarrhea', 'nausea', 'vomiting',
        
        # Body Parts and Systems
        'heart', 'lung', 'liver', 'kidney', 'brain', 'stomach', 'intestine',
        'muscle', 'bone', 'joint', 'skin', 'blood', 'nerve', 'throat', 'ear',
        'eye', 'nose', 'mouth', 'teeth', 'gum',
        
        # Medical Terms
        'doctor', 'hospital', 'clinic', 'emergency', 'ambulance', 'surgery',
        'operation', 'examination', 'test', 'scan', 'xray', 'mri', 'ct',
        'diagnosis', 'prognosis', 'symptom', 'side effect',
        
        # Health and Wellness
        'health', 'medical', 'disease', 'prevention', 'treatment', 'care',
        'wellness', 'recovery', 'healing', 'immunity', 'vaccination',
        
        # Mental Health
        'anxiety', 'depression', 'stress', 'mental health', 'psychiatric',
        'psychological', 'therapy', 'counseling', 'addiction'
    }
    
    # Medical question patterns
    medical_patterns = [
        r'how (to|do I|should I) treat',
        r'what (is|are) the (symptoms|signs|causes|treatments|side effects)',
        r'(how|when) (to|should I) take',
        r'(is|are) .* (safe|effective|dangerous)',
        r'can I take',
        r'should I see a doctor',
        r'what does .* (mean|indicate)',
        r'why (do|does|am I) .* (feel|have|experiencing)',
        r'(how long|when) (will|does|should)',
        r'(is|are) .* (normal|serious|dangerous|concerning)',
        r'(what|how) (is|are) the (risks|benefits|effects)',
        r'(how|what) (can|should) I do (about|for|to treat)',
        r'(what|which) medicine',
        r'(how|what) causes',
        r'(is|can) .* (contagious|infectious|hereditary)',
        r'(what|how) (is|are) the (dosage|dose|prescription)',
        r'(how|what) (is|are) the recommended'
    ]

    query_lower = query.lower()
    
    # Check medical patterns
    for pattern in medical_patterns:
        if re.search(pattern, query_lower):
            return True
    
    # Check for medical keywords
    words = set(re.findall(r'\w+', query_lower))
    if any(keyword.lower() in words or keyword.lower() in query_lower for keyword in medical_keywords):
        return True
    
    return False

def run_ollama_model(prompt, system_prompt=None):
    """
    Query the Ollama model with enhanced medical context.
    Only processes medical-related queries.
    
    Args:
        prompt (str): The user query
        system_prompt (str, optional): A system prompt to guide the model's behavior
        
    Returns:
        str: The model's response
    """
    # First check if it's a medical query
    if not is_medical_query(prompt):
        return "I am a medical assistant and can only answer health-related questions. Please ask me something about health, medicine, or medical conditions."
    
    try:
        # Construct the messages
        messages = []
        if system_prompt:
            messages.append({
                'role': 'system',
                'content': system_prompt
            })
        
        # Add specific context for medication queries
        if any(med in prompt.lower() for med in ['tablet', 'medicine', 'drug', 'dosage', 'crocin', 'prescription']):
            medication_prompt = """Provide a BRIEF response about the medication:
            • Generic/Brand name (if asked)
            • Specific dosage (if asked)
            • Direct answer to the question
            • Critical warnings (if relevant)
            Keep it under 100 words."""
            
            messages.append({
                'role': 'system',
                'content': medication_prompt
            })
        
        # Add specific context for symptom queries
        elif any(symptom in prompt.lower() for symptom in ['pain', 'ache', 'fever', 'symptoms', 'feeling']):
            symptom_prompt = """Provide a BRIEF response about the symptoms:
            • Direct answer to the specific question
            • Immediate actions to take
            • When to seek medical help (if urgent)
            Keep it under 100 words."""
            
            messages.append({
                'role': 'system',
                'content': symptom_prompt
            })
        
        # Add specific context for treatment queries
        elif 'treat' in prompt.lower() or 'treatment' in prompt.lower():
            treatment_prompt = """Provide a BRIEF treatment response:
            • Direct treatment steps
            • Important precautions
            • When to see a doctor (if needed)
            Keep it under 100 words."""
            
            messages.append({
                'role': 'system',
                'content': treatment_prompt
            })
        
        messages.append({
            'role': 'user',
            'content': f"Provide a brief, direct answer to: {prompt}"
        })
        
        # Get response from Ollama
        response = client.chat(model=MODEL_NAME, messages=messages)
        return response['message']['content']
            
    except Exception as e:
        logger.error(f"Error querying model: {e}")
        return "Sorry, there was an error processing your request. Please try again."

def parse_medical_response(response):
    """
    Extract structured information from the model's response if available.
    
    Args:
        response (str): The raw response from the model
        
    Returns:
        dict: Structured information if available, None otherwise
    """
    # Try to find JSON blocks in the response
    json_pattern = r'\{.*\}'
    json_matches = re.findall(json_pattern, response, re.DOTALL)
    
    if json_matches:
        for json_str in json_matches:
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                continue
    
    return None

def get_medical_system_prompt():
    """
    Return a concise system prompt optimized for medical queries.
    """
    return """You are a medical AI assistant. Provide concise, direct answers focusing ONLY on what was asked. Do not provide additional information unless specifically requested.

    RESPONSE GUIDELINES:
    1. Be brief and specific
    2. Answer exactly what was asked
    3. Use bullet points for clarity
    4. Include only relevant information
    5. Add a short disclaimer at the end

    For medication queries, ONLY include:
    • Name and type of medication
    • Specific dosage asked about
    • Direct answer to the specific question
    • Relevant warnings (if critical)

    For symptom queries, ONLY include:
    • Direct answer to the specific question
    • Immediate actions to take
    • When to seek medical help (if urgent)

    For treatment queries, ONLY include:
    • Direct treatment steps
    • Important precautions
    • When to see a doctor

    Keep responses under 100 words unless more detail is specifically requested.
    End with: "Note: Consult a healthcare provider for medical advice."
    """

def stream_ollama_model(prompt, system_prompt=None):
    """
    Stream output from the Ollama model.
    Only processes medical-related queries.
    
    Args:
        prompt (str): The user query
        system_prompt (str, optional): A system prompt to guide the model's behavior
        
    Yields:
        str: Chunks of the model's response
    """
    # Check if the query is medical-related
    if not is_medical_query(prompt):
        yield "I'm a medical assistant and can only answer health-related questions. Please ask me something about health, medicine, or wellness."
        return
    
    try:
        # Construct the messages
        messages = []
        if system_prompt:
            messages.append({
                'role': 'system',
                'content': system_prompt
            })
        
        messages.append({
            'role': 'user',
            'content': prompt
        })
        
        # Stream response from Ollama
        for chunk in client.chat(model=MODEL_NAME, messages=messages, stream=True):
            if 'message' in chunk and 'content' in chunk['message']:
                yield chunk['message']['content']
                
    except Exception as e:
        logger.error(f"Error streaming from model: {e}")
        yield "Sorry, there was an error processing your request." 