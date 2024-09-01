
# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

import sys
import os
# from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
# from langchain_chroma import Chroma

from dotenv import load_dotenv, find_dotenv

# Load environment variables from a .env file
load_dotenv(find_dotenv())

# Retrieve and set the Google Generative AI API key from environment variables
api_key = os.getenv('GOOGLE_API_KEY')


server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if server_dir not in sys.path:
    sys.path.append(server_dir)
    
print(sys.path)

from scripts.vectorLoading import *
from scripts.casekeywordsextraction import *
from scripts.extractfiles import *
from scripts.summarizationPrompting import *
from scripts.keyphrasesextraction import *

from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage

def Previous_Cases_With_Summary_Fetch(bail_applicant_case_record_text, path_vector_store, no_of_pgs=5):
  # Initialize the LLM
  vectorDB = saved_vectorDB_loading(path_vector_store)
  
  print(vectorDB.similarity_search(bail_applicant_case_record_text, k=15))

  case_keywords = case_keywords_extraction(bail_applicant_case_record_text)
  

  mapped_docs = extract_file_info_from_similar_text(case_keywords, vectorDB)
  if not mapped_docs:
    print("No relevant documents found.")
    return

  summaries = {}
  
  llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

  # PromptTemplate
  qa_prompt_template = Summarization_prompting()

  counter = 0

  for case_file, metadata in mapped_docs.items():
    if counter == no_of_pgs:
      
      print("\n\n\nEXIT")
      return summaries
    content = metadata['content']
    page_no = metadata['page_number']
    # Generate the summary using LLM models (do this with LLama or a better summarization model)
    summary_input = qa_prompt_template.format(context=content)
    message = [HumanMessage(content=summary_input)]

    result = llm(messages=message)
    
    print(counter)
    # Store the result in the summaries dictionary
    file_path = case_file

    # Replace the base directory and forward slashes
    windows_path = file_path.replace('/content/drive/MyDrive', 'C:\\full_St\\bail-reckoner\\server\\scripts')
    windows_path = windows_path.replace('/', '\\')
    print(windows_path)

    summaries[windows_path] = {"content" : result.content, "page_no": page_no} 
    print("Case_file:     ", windows_path, "\n")
    print("Summary:       ", result.content)
    print("Page No: ", page_no)
    print()
    counter += 1
  return summaries
# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

# path_vector_store = "server/scripts/Bail_Saarathi/vector_database/Case_Files_VectorEmbeddings/"

# bail_applicant_case_record_text = input("Case RECORD: ")
# # Output in the form of KEY VALUE PAIR with Keys as file names, Values as summary
# Previous_Cases_Maps = Previous_Cases_With_Summary_Fetch(bail_applicant_case_record_text, path_vector_store, 3)

# print(Previous_Cases_Maps)


'''
Case Title: The State vs. [Defendant's Name]  Case Number: [To Be Assigned]  Date of Incident: 12:00 AM, [Date]  Location: [Shop Name], Bangalore  Charges: Pity Theft, Robbery  Defendant: [Defendant's Name]  Address: [Defendant's Address] Occupation: [Defendant's Occupation] Age: [Defendant's Age] Gender: [Defendant's Gender] Legal Representation: [Lawyer's Name]  Chargesheet 1. Overview of the Incident:  On the night of [Date], at approximately 12:00 AM, the defendant was allegedly involved in a criminal act at [Shop Name], located in Bangalore. The incident involved the following charges:  Pity Theft: Alleged petty theft committed by the defendant. Robbery: The defendant is charged with robbery, which involved using force or intimidation to unlawfully take property from the shop. 2. Description of Charges:  a. Pity Theft:  Details of Theft: The defendant is accused of unlawfully taking small items from the shop without the consent of the shop owner. The items stolen include [List of Stolen Items, if known]. Evidence: Surveillance footage from the shop, witness testimonies, and recovered stolen items (if any). b. Robbery:  Details of Robbery: The defendant is alleged to have forcibly taken property from the shop, threatening or using intimidation against the shopkeeper or any employees present at the time. Evidence: Eyewitness accounts, surveillance footage, and any physical evidence related to the force or intimidation used. 3. Witnesses:  Witness 1: [Name, Address, Contact Information] – Eyewitness to the incident. Witness 2: [Name, Address, Contact Information] – Employee at the shop who observed the defendant’s actions. 4. Evidence:  Surveillance Footage: Video recordings showing the defendant’s actions during the incident. Physical Evidence: Items recovered from the defendant that were stolen from the shop (if applicable). Witness Statements: Statements from individuals who witnessed the crime or were present at the scene. 5. Charges Under Relevant Sections:  Pity Theft: IPC Section 378 (Theft) and any applicable local legal provisions. Robbery: IPC Section 390 (Robbery) and IPC Section 392 (Punishment for Robbery). 6. Investigation Summary:  The investigation was conducted by [Investigation Officer's Name], who gathered evidence, interviewed witnesses, and compiled the case details. The collected evidence supports the charges of petty theft and robbery.  7. Next Steps:  Court Hearing: The case is scheduled for a preliminary hearing on [Date]. Bail Status: The defendant's bail status is [Bail Granted/Denied]. Further Proceedings: The case will proceed to trial where the evidence will be presented, and a verdict will be determined based on the charges and the evidence provided. Case Prepared By: [Investigating Officer's Name] [Designation] [Date]  Approved By: [Senior Officer's Name] [Designation] [Date]  Note: This chargesheet is prepared for the purpose of formal legal proceedings and is subject to further review by the court. The defendant is presumed innocent until proven guilty in a court of law.
''' 