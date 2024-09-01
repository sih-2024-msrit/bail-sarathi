import os 
import google.generativeai as genai

from dotenv import load_dotenv, find_dotenv

# Load environment variables from a .env file
load_dotenv(find_dotenv())

API_KEY =  os.getenv('GOOGLE_API_KEY')
genai.configure(api_key = API_KEY)

model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history = [])


def load_knowledge_base(file_path: str) -> str:
    with open(file_path, 'r') as file:
        return file.read()

def get_response(question):

    knowledge_base = load_knowledge_base('C:/full_St/bail-reckoner/server/scripts/chatbot/knowledge_base.txt')

    exit_commands = {"bye", "exit", "quit"}

    if question.lower() in exit_commands:
        response="Thank you for using Bail Sarathi! If you need more assistance, feel free to come back anytime. Goodbye!"
        return response
    
    elif question.lower() == 'help':
        response="\nBail Sarathi - Your Guide to Understanding Bail Procedures:"+"\nAvailable commands:"+"\n'help' - Show this help message"+"\n'bye', 'exit', 'quit' - Exit the chatbot"+"\n Any other text - Ask a question about bail procedures or the features of Bail Sarathi.\n"
        return response
    
    else:
        response = chat.send_message(knowledge_base + question)
        result=f"Bail Sarathi: {response.text}"
        return result

