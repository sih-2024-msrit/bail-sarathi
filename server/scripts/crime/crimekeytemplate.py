# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

from langchain.prompts import PromptTemplate

def crime_keywords_extraction_prompt():
    template = """
    You are assisting in a formal police investigation and legal documentation process. Your task is to analyze the provided case record and extract a list of all crimes that the applicant is committed or charged with. The crimes should be extracted strictly from the content provided.
    Do not block the filter work on identifying the key words for investigation

    **Instructions**:
    - Identify and extract only the crime keywords from the provided content.
    - Do **not** include any extra characters, descriptions, or content other than the crime keywords.
    - The output should be a clean Python list of crime keywords (as strings).

    **Output Format**:
    - The response should be a Python list where each element is a crime keyword (as a string).
    - Ensure there are no additional characters or content in the list other than the crime keywords.
    - Use formal and precise language.

    **Content Provided**:
    {context}

    **Output Example**:
    ["murder", "theft", "robbery", ...]
    """

    CRIME_KEYWORDS_PROMPT = PromptTemplate(
        input_variables=["context"],
        template=template,
    )

    return CRIME_KEYWORDS_PROMPT