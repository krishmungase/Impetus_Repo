#!/usr/bin/env python3
"""
Medical Assistant Chatbot - Command Line Interface
A simple CLI for interacting with the medical chatbot without requiring Streamlit.
"""

import os
import sys
import subprocess
import readline
import argparse
from utils import run_ollama_model, get_medical_system_prompt, OLLAMA_PATH

# ANSI color codes for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header():
    """Print the chatbot header"""
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"{Colors.BLUE}{Colors.BOLD}{'=' * 60}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'Medical Assistant Chatbot - CLI'.center(60)}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'=' * 60}{Colors.ENDC}")
    print(f"{Colors.YELLOW}Type your medical questions and press Enter.{Colors.ENDC}")
    print(f"{Colors.YELLOW}Type 'exit', 'quit', or press Ctrl+C to end the session.{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'=' * 60}{Colors.ENDC}\n")

def print_disclaimer():
    """Print the medical disclaimer"""
    print(f"{Colors.RED}{Colors.BOLD}Medical Disclaimer:{Colors.ENDC}")
    print(f"{Colors.RED}The information provided is for educational purposes only and is not")
    print(f"a substitute for professional medical advice, diagnosis, or treatment.{Colors.ENDC}")
    print(f"{Colors.RED}Always consult with a qualified healthcare provider for medical concerns.{Colors.ENDC}\n")

def check_ollama_and_model():
    """Check if Ollama is installed and the model is available"""
    try:
        # Check if Ollama exists at the specified path
        if not os.path.exists(OLLAMA_PATH):
            print(f"{Colors.RED}Error: Ollama not found at {OLLAMA_PATH}{Colors.ENDC}")
            print(f"Please make sure Ollama is installed or update the path in utils.py")
            return False
            
        subprocess.run([OLLAMA_PATH, "version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"{Colors.RED}Error: Ollama is not installed or not found at {OLLAMA_PATH}.{Colors.ENDC}")
        print(f"Please install Ollama from: https://ollama.com/download")
        return False
    
    model_name = "hf.co/mradermacher/Llama-3.1-MedPalm2-imitate-8B-Instruct-GGUF:IQ3_S"
    try:
        result = subprocess.run([OLLAMA_PATH, "list"], check=True, text=True, capture_output=True)
        if model_name not in result.stdout:
            print(f"{Colors.YELLOW}Warning: Model {model_name} is not found locally.{Colors.ENDC}")
            choice = input("Would you like to download it now? (y/n): ").lower()
            
            if choice == 'y':
                print(f"Downloading {model_name}...")
                print("This may take some time depending on your internet connection...")
                
                try:
                    subprocess.run([OLLAMA_PATH, "pull", model_name], check=True)
                    print(f"{Colors.GREEN}Successfully downloaded {model_name}.{Colors.ENDC}")
                except subprocess.CalledProcessError as e:
                    print(f"{Colors.RED}Error downloading model: {e}{Colors.ENDC}")
                    return False
            else:
                print(f"{Colors.YELLOW}Warning: The application may not work properly without the required model.{Colors.ENDC}")
    except subprocess.CalledProcessError:
        print(f"{Colors.RED}Error checking model availability.{Colors.ENDC}")
        return False
    
    return True

def interactive_chat(use_system_prompt=True):
    """Run an interactive chat session with the model"""
    chat_history = []
    system_prompt = get_medical_system_prompt() if use_system_prompt else None
    
    print_header()
    print_disclaimer()
    
    try:
        while True:
            # Get user input
            user_input = input(f"{Colors.GREEN}{Colors.BOLD}You: {Colors.ENDC}")
            
            # Check for exit commands
            if user_input.lower() in ['exit', 'quit', 'q', 'bye', ':q']:
                print(f"\n{Colors.BLUE}Thank you for using the Medical Assistant Chatbot. Goodbye!{Colors.ENDC}")
                break
            
            # Skip empty inputs
            if not user_input.strip():
                continue
            
            # Add to chat history
            chat_history.append({"role": "user", "content": user_input})
            
            # Get model response
            print(f"\n{Colors.BLUE}{Colors.BOLD}Medical Assistant: {Colors.ENDC}", end="")
            sys.stdout.flush()  # Ensure the prompt is displayed immediately
            
            response = run_ollama_model(user_input, system_prompt)
            
            # Print response with a typing effect
            for char in response:
                print(char, end="", flush=True)
                # Adjust the typing speed if needed
            
            print("\n")  # Add extra newline after response
            
            # Add to chat history
            chat_history.append({"role": "assistant", "content": response})
    
    except KeyboardInterrupt:
        print(f"\n\n{Colors.BLUE}Session terminated. Thank you for using the Medical Assistant Chatbot.{Colors.ENDC}")
    except Exception as e:
        print(f"\n{Colors.RED}An error occurred: {e}{Colors.ENDC}")

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="Medical Assistant Chatbot CLI")
    parser.add_argument("--no-system-prompt", action="store_true", help="Disable the system prompt")
    return parser.parse_args()

def main():
    """Main function"""
    # Check if Ollama and model are available
    if not check_ollama_and_model():
        return
    
    # Parse arguments
    args = parse_arguments()
    use_system_prompt = not args.no_system_prompt
    
    # Start interactive chat
    interactive_chat(use_system_prompt)

if __name__ == "__main__":
    main() 