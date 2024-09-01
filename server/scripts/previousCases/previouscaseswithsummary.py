
# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

import sys
import os
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
from langchain_chroma import Chroma


server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if server_dir not in sys.path:
    sys.path.append(server_dir)
    


from scripts.general.vectorLoading import *
from scripts.previousCases.casekeywordsextraction import *
from scripts.previousCases.extractfiles import *
from scripts.previousCases.summarizationPrompting import *
from scripts.previousCases.keyphrasesextraction import *


def Previous_Cases_With_Summary_Fetch(bail_applicant_case_record_text, path_vector_store, no_of_pgs=5):
  # Initialize the LLM
  llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

  vectorDB = saved_vectorDB_loading(path_vector_store)

  case_keywords = case_keywords_extraction(bail_applicant_case_record_text)

  mapped_docs = extract_file_info_from_similar_text(case_keywords, vectorDB)
  if not mapped_docs:
    print("No relevant documents found.")
    return

  summaries = {}

  # PromptTemplate
  qa_prompt_template = Summarization_prompting()

  counter = 0

  for case_file, content in mapped_docs.items():
    if counter == no_of_pgs:
      break
    counter = no_of_pgs
    # Generate the summary using LLM models (do this with LLama or a better summarization model)
    summary_input = qa_prompt_template.format(context=content)
    message = [HumanMessage(content=summary_input)]

    result = llm(messages=message)

    # Store the result in the summaries dictionary
    summaries[case_file] = result.content
    print("Case_file:     ", case_file, "\n")
    print("Summary:       ", result.content)
    print()
    counter += 1
  return summaries