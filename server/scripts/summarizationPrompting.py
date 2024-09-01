# IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

# import sys
# import os


# server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# if server_dir not in sys.path:
#     sys.path.append(server_dir)

from langchain.prompts import PromptTemplate

def Summarization_prompting():
    template = """
    You are a legal assistant specialized in Indian legal cases. Your task is to analyze the provided case report, identify the most important key charges, and highlight the context of the case.

    **Metadata**:
    - **Case Name**: Automatically identify the case name from the text.
    - **Date of Judgment**: Automatically identify the date of judgment.
    - **Parties Involved**: Automatically identify the parties involved.
    - **Court**: Automatically identify the court name.
    - **Judge(s)**: Automatically identify the judge(s) involved.

    **Key Charges and Context**:
    - Summarize the key charges or disputes in the case.
    - Highlight the most critical aspects and context of the case.
    - Key legal aspects and evidence presented.
    - Focus on the legal precedents and rationale for the judgment.
    - The final judgment and rationale.

    Your response should:
    - Avoid unnecessary details.
    - Focus only on the critical legal points and context.
    - Present the information concisely and clearly.
    - Use formal and precise language.
    - If you can't find relevant information, state: "No relevant information found."

    **Case Analysis**:
    {context}
    """

    Summarization_prompting = PromptTemplate(
        input_variables=["context"],
        template=template,
    )

    return Summarization_prompting