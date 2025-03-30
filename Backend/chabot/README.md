# Medical Assistant Chatbot

A minimalist, aesthetic chatbot application that answers medical queries and provides medical assistance using the orca-mini model. The chatbot has been configured to only respond to health-related questions.

![Medical Assistant Chatbot](https://via.placeholder.com/800x450.png?text=Medical+Assistant+Chatbot)

## Features

- Medical query answering only (filters out non-medical questions)
- Clean, minimalist UI design
- Health information and advice
- Simple and intuitive interface

## Requirements

- Python 3.8+
- Flask
- Ollama
- llama2-uncensored model

## Installation

1. Clone this repository
2. Install dependencies: 
   ```
   pip install flask
   ```
3. Make sure Ollama is installed on your system from [Ollama's website](https://ollama.com/download)
4. Run the application:
   ```
   python medical_chatbot.py
   ```

## Model Information

This chatbot uses the orca-mini model, which is a very small and fast language model (around 3GB). While it's not specifically fine-tuned for medical domain knowledge like larger medical models, it can still provide helpful general information on medical topics.

The application has been configured to only respond to medical-related queries, filtering out non-health related questions.

## How It Works

1. The UI is built with HTML, CSS, and JavaScript for a clean, modern appearance
2. Flask backend processes requests and communicates with the Ollama model
3. Queries are first filtered to ensure they are medical-related
4. The model uses a medical system prompt to guide responses appropriately
5. Responses are streamed back to the UI with a typing animation

## Customization

- Edit `static/styles.css` to change the appearance
- Modify the medical keywords in `utils.py` to adjust the filtering
- Edit the system prompt in `utils.py` to change how the model responds

## Disclaimer

This chatbot provides information for educational purposes only and is not a substitute for professional medical advice. 