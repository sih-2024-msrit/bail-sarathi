
from langchain.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.embeddings import HuggingFaceEmbeddings
import torch
from langchain.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma


def saved_vectorDB_loading(save_directory):
  device = "cuda" if torch.cuda.is_available() else "cpu"
  print(f"Using device: {device}")
  vectorDB = Chroma(
    persist_directory=save_directory,
    embedding_function= HuggingFaceEmbeddings(
            model_name='sentence-transformers/all-MiniLM-L6-v2',
            model_kwargs={'device': device}
            )
    )
  return vectorDB