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

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage

from scripts.ipctemplate import *
# import json


def map_IPC_sections(crimes_list, vectorDB):
  # Initialize the LLM
  llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0,google_api_key=api_key)

  qa_prompt_template = ipc_section_mapping_prompt()

  crimes_to_ipc = {}
  
  ipc_docs = vectorDB.similarity_search(crimes_list, k=15)

  print("Crimes: \n", ipc_docs)

  summary_input = qa_prompt_template.format(context=ipc_docs, crimes_list=crimes_list)
  message = [HumanMessage(content=summary_input)]

  result = llm(messages=message)

  map_str = result.content

  start_index = map_str.find('{')
  end_index = map_str.rfind('}') + 1

  # Store the content including the curly braces
  dict_content = map_str[start_index:end_index]
  print()
  print(dict_content)
  crimes_to_ipc = eval(dict_content)

  # try:
  #   crimes_to_ipc = json.loads(result.content)
  #   print(crimes_to_ipc)

  # except json.JSONDecodeError as e:
  #   print(f"Error decoding JSON: {e}")



  return crimes_to_ipc