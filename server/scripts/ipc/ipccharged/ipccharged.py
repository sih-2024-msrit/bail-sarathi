# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
import sys
import os
from langchain_chroma import Chroma

server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if server_dir not in sys.path:
    sys.path.append(server_dir)

from scripts.general.vectorLoading import *
from scripts.crime.crimekey import *
from scripts.ipc.ipcmap.ipcmap import *



def IPC_Sections_Charged(bail_applicant_crime_record_text, path_vector_store):


  vectorDB = saved_vectorDB_loading(save_directory = path_vector_store)

  crimes_commited_list = crime_keywords_extraction(bail_applicant_crime_record_text)
  print(crimes_commited_list)

  crimes_to_ipc = map_IPC_sections(crimes_commited_list, vectorDB)
  print(crimes_to_ipc)

  return crimes_to_ipc

