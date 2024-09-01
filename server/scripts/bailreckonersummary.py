
# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
import sys
import os

from dotenv import load_dotenv, find_dotenv

# Load environment variables from a .env file
load_dotenv(find_dotenv())

# Retrieve and set the Google Generative AI API key from environment variables
api_key = os.getenv('GOOGLE_API_KEY')

server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if server_dir not in sys.path:
    sys.path.append(server_dir)

from scripts.bailcontextprompting import *
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage

def Bail_Reckoner_Summary(text, case_number, application_number):
  # Initialize the LLM
  llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0,google_api_key=api_key)

  # PromptTemplate
  qa_prompt_template = bail_context_prompting()

  summary_input = qa_prompt_template.format(context=text)
  message = [HumanMessage(content=summary_input)]

  result = llm(messages=message)

  print(f"Case_file:    {case_number}            Application Number: {application_number}")
  print(f"Highlights:       {result.content}")
  print()
  return result.content

