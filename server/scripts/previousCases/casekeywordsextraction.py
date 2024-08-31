# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

import sys
import os


server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if server_dir not in sys.path:
    sys.path.append(server_dir)

from scripts.previousCases.keyphrasesextraction import *
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage

def case_keywords_extraction(case_record_text):
  # Initialize the LLM
  llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
  qa_prompt_template = key_phrases_extraction_prompt()

  summary_input = qa_prompt_template.format(context=case_record_text)
  message = [HumanMessage(content=summary_input)]

  result = llm(messages=message)

  crimes_list = []
  print(result.content)

  content_list = result.content

  start_index = content_list.find('[')
  end_index = content_list.rfind(']') + 1
  crimes_list = content_list[start_index:end_index]

  print(result)

  return crimes_list
