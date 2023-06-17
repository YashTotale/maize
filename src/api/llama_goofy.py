import os
from llama_index import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    ListIndex,
    StorageContext,
    load_index_from_storage,
)
from flask import request

from flask import Flask


PORT = 5000
app = Flask(__name__)

# NOTE: for local testing only, do NOT deploy with your key hardcoded
# kailash's: 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
os.environ["OPENAI_API_KEY"] = "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"

# sasvath's api key: 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


@app.route("/")
def home():
    return "Welcome to the Maize API. Use /api/ to call API routes."


@app.route("/api/")
def home2():
    return "nice"


index = None
index_dir = "../indexes"  # directory to store the index


@app.route("/api/init", methods=["GET"])
def initialize_index():
    global index
    storage_context = StorageContext.from_defaults(persist_dir=index_dir)
    if os.path.exists(index_dir):
        index = load_index_from_storage(storage_context)
    else:
        documents = SimpleDirectoryReader("../data").load_data()

        print(documents)

        index = ListIndex.from_documents(documents)

        storage_context.persist(index_dir)

    return documents, 200


@app.route("/api/query", methods=["GET"])
def query_index():
    global index
    query_text = request.args.get("text", None)
    if query_text is None:
        return "No text found, please include a ?text=blah parameter in the URL", 400
    query_engine = index.as_query_engine()
    response = query_engine.query(query_text)

    print(query_text)

    return str(response), 200


if __name__ == "__main__":
    initialize_index()

    app.run(host="0.0.0.0", port=PORT)
