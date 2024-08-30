# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

def IPC_Sections_Charged(bail_applicant_crime_record_text, path_vector_store):

  # path_vector_store = "/content/drive/MyDrive/Bail_Saarathi/vector_database/IPC_Sections_VectorEmbeddings/"
  vectorDB = saved_vectorDB_loading(save_directory = path_vector_store)

  crimes_commited_list = crime_keywords_extraction(bail_applicant_crime_record_text)
  print(crimes_commited_list)

  crimes_to_ipc = map_IPC_sections(crimes_commited_list, vectorDB)
  print(crimes_to_ipc)

  return crimes_to_ipc

