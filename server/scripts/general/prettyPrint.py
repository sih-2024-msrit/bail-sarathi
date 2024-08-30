
def pretty_print_docs(docs):
    print(f"\n{'-' * 100}\n".join([f"Extraction {i+1}:\n\n" + d.page_content + "\nMetaData : " + d.metadata['source'] for i, d in enumerate(docs)]))

# question = "Cases with crime and murder"

def related_pages(text, vectorDB, no_of_pages=3):
    docs = vectorDB.similarity_search(text, k=no_of_pages)
    print("Length of similar related documents fetched: ", len(docs))
    print("Content of the docs is as follows: ")
    pretty_print_docs(docs)
    return docs
