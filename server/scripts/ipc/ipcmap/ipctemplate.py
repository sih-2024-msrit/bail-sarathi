# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

from langchain.prompts import PromptTemplate

# Define the IPC section mapping prompt
def ipc_section_mapping_prompt():
    template = """
    You are an expert in Indian legal documentation. Your task is to analyze the provided list of crimes and map each crime to the corresponding IPC Section, Clause, or Article, strictly using the following legal documents:
    - Indian Penal Code (IPC)
    - Bharatiya Nyaya Sanhita Bhartiya 2023
    - Bharatiya Saakshya Adhiniyam 2023
    - Bharatiya Nagarik Suraksha Sanhita 2023

    **Instructions**:
    - For each crime provided, identify and extract only the name of the relevant Section, Clause, or Article from the legal documents mentioned above.
    - Do **not** include the content or description of the Sections, Clauses, or Articles, only their names.
    - If a crime maps to multiple Sections/Clauses/Articles, list all applicable names.
    - If no relevant Section/Clause/Article is found, state: "No relevant Section/Clause/Article found."

    **Output Format**:
    - The response should be a Python dictionary where the key is the crime (as a string), and the value is a list of the name(s) of the corresponding Section(s)/Clause(s)/Article(s) (as strings).
    - If no relevant Section/Clause/Article is found for a crime, the value should be ["No relevant Section/Clause/Article found"].
    - Use formal and precise language.
    - Do not include any additional text or explanation.
    - Do not include "python" too or anything extra characters or words

    **Crimes List**:
    {context}

    **Output Example**:
    {{
        "murder": ["IPC Section 302"],
        "theft": ["IPC Section 379"],
        "cybercrime": ["No relevant Section/Clause/Article found"],
        ...
    }}
    """

    CRIME_TO_IPC_PROMPT = PromptTemplate(
        input_variables=["context"],
        template=template,
    )

    return CRIME_TO_IPC_PROMPT
