import os
import google.generativeai as genai
import sys
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
sys.path.append('../..')

# Retrieve and set the Google Generative AI API key from the environment variables
api_key = os.getenv('GEMINI_API_KEY')
if api_key is None:
    raise ValueError("Environment variable 'GEMINI_API_KEY' is not set.")
os.environ['GOOGLE_API_KEY'] = api_key

# Configure the API key for the Google Generative AI library
genai.configure(api_key=api_key)

# Retrieve and set the Hugging Face API token
hf_token = os.getenv('HF_TOKEN')
if hf_token is None:
    raise ValueError("Environment variable 'HF_TOKEN' is not set.")
os.environ['HF_TOKEN'] = hf_token
inference_api_key = hf_token

# Now you can use inference_api_key for Hugging Face API requests.