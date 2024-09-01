# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

from langchain.prompts import PromptTemplate

# Define the IPC section mapping prompt with two input parameters: crimes_list and context
def ipc_section_mapping_prompt():
    template = """
    You are an expert in Indian legal documentation. Your task is to analyze the provided list of crimes and map each crime to the corresponding IPC Section, Clause, or Article, strictly using the following legal documents given in the `context`:
    - Indian Penal Code (IPC)
    - Bharatiya Nyaya Sanhita Bhartiya 2023
    - Bharatiya Saakshya Adhiniyam 2023
    - Bharatiya Nagarik Suraksha Sanhita 2023

    **Instructions**:
    - For each crime provided in the `crimes_list`, identify and extract *only the name of the relevant Section, Clause, or Article from the `context` provided* to enhance accuracy, but *only map the crimes explicitly listed in the `crimes_list`.*
    - Include only the *Document Section and Clause name and number* of the Sections, Clauses, or Articles, not its description.
    - If a *crime maps* to *multiple Sections/Clauses/Articles*, *list all applicable names*.
    - If no relevant Section/Clause/Article is found, state: "No relevant Section/Clause/Article found."

    **Output Format**:
    - The response should be a Python dictionary where the key is the crime (as a string) from `crimes_list`, and the value is a list of the title name(s) and numbers of the corresponding Section(s)/Clause(s)/Article(s) (as strings) like ["IPC Section 305", "Bharatiya Nyaya Sanhita Clause 304 "].
    - If no relevant Section/Clause/Article is found for a crime, the value should be ["No relevant Section/Clause/Article found"].
    - Use formal and precise language.
    - Do not include any additional text or explanation.
    - Do not include "python" or any extra characters or words.

    **Crimes List**:
    {crimes_list}

    **Context**:
    {context}

    **Output Example for reference do not use this**:
    {{
        "murder": ["IPC Section 309", "Bharatiya Nyaya Sanhita Clause 304" ],
        "theft": ["IPC Section 379"],
        "cybercrime": ["No relevant Section/Clause/Article found"],
        ...
    }}
    """

    CRIME_TO_IPC_PROMPT = PromptTemplate(
        input_variables=["crimes_list", "context"],
        template=template,
    )

    return CRIME_TO_IPC_PROMPT
