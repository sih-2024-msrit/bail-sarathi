# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
import sys
import os


server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if server_dir not in sys.path:
    sys.path.append(server_dir)


from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
from scripts.ipc.ipcmap.ipctemplate import *
# import json

def map_IPC_sections(crimes_list, vectorDB):
  # Initialize the LLM
  llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

  qa_prompt_template = ipc_section_mapping_prompt()

  crimes_to_ipc = {}

  summary_input = qa_prompt_template.format(context=crimes_list)
  message = [HumanMessage(content=summary_input)]

  result = llm(messages=message)

  map_str = result.content

  start_index = map_str.find('{')
  end_index = map_str.rfind('}') + 1

  # Store the content including the curly braces
  dict_content = map_str[start_index:end_index]
  crimes_to_ipc = eval(dict_content)

  # try:
  #   crimes_to_ipc = json.loads(result.content)
  #   print(crimes_to_ipc)

  # except json.JSONDecodeError as e:
  #   print(f"Error decoding JSON: {e}")



  return crimes_to_ipc