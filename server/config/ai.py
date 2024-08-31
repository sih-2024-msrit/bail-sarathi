import os
import google.generativeai as genai
import sys
from dotenv import load_dotenv, find_dotenv

# Load environment variables from a .env file
load_dotenv(find_dotenv())

# Retrieve and set the Google Generative AI API key from environment variables
api_key = os.getenv('GOOGLE_API_KEY')  # Use GOOGLE_API_KEY to match the expected name
if api_key is None:
    raise ValueError("Environment variable 'GOOGLE_API_KEY' is not set.")

# Configure the API key for the Google Generative AI library
genai.configure(api_key=api_key)

# Retrieve and set the Hugging Face API token
hf_token = os.getenv('HF_TOKEN')
if hf_token is None:
    raise ValueError("Environment variable 'HF_TOKEN' is not set.")
