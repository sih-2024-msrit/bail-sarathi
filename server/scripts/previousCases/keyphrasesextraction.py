# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
# import sys
# import os


# server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# if server_dir not in sys.path:
#     sys.path.append(server_dir)

from langchain.prompts import PromptTemplate

def key_phrases_extraction_prompt():
    template = """
    You are assisting in a formal police investigation and legal documentation process. Your task is to analyze the provided case record and extract a list of major key phrases that are critical to the investigation. The key phrases should include significant crimes and other relevant terms from the case record.

    **Instructions**:
    - Identify and extract key phrases that are crucial to understanding the case, including specific crimes (e.g., murder, theft, rape) and relevant context (e.g., dowry, financial fraud, cyber scam).
    - Also include phrases of special scenarios that relate to the case and give description of the investiagtion like (broad day light, shop theft, physicaly damage, mentally challenged man, etc)
    - Do **not** include any extra characters, descriptions, or content other than the key phrases.
    - The output should be a clean Python list of key phrases (as strings).

    **Output Format**:
    - The response should be a Python list where each element is a key phrase (as a string).
    - Ensure there are no additional characters or content in the list other than the key phrases.
    - Use formal and precise language.

    **Content Provided**:
    {context}

    **Output Example**:
    ["wife killed", "dowry", "rape", "murder", "cyber scam", "financial fraud", "theft"]
    """

    KEY_PHRASES_PROMPT = PromptTemplate(
        input_variables=["context"],
        template=template,
    )

    return KEY_PHRASES_PROMPT
