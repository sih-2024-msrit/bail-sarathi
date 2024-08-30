# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

path_vector_store = "/content/drive/MyDrive/Bail_Saarathi/vector_database/IPC_Sections_VectorEmbeddings/"
bail_applicant_case_record_text = input("Case RECORD: ")

crime_to_ipc = IPC_Sections_Charged(bail_applicant_case_record_text, path_vector_store)
print(crime_to_ipc)