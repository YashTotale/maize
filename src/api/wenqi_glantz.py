import os
import pinecone
import tempfile
from flask import Flask, request
from llama_index import (
    VectorStoreIndex,
    Document,
    StorageContext,
)
from llama_index.vector_stores import PineconeVectorStore
import json

PORT = 3001
app = Flask(__name__)

os.environ["STORAGE_DIR"] = "./storage"
os.environ["GRANARY_DIR"] = "./granary"
os.environ["TEMP_DIR"] = "./temp"
os.environ["FILES_DB"] = "./db.json"
os.environ["VECTOR_DIM"] = "1536"
os.environ["PINECONE_API_KEY"] = "2c5c1d81-7373-4c22-bedd-eaca30b6109f"
os.environ["PINECONE_ENVIRONMENT"] = "us-west1-gcp-free"
os.environ["OPENAI_API_KEY"] = "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"


def init_pinecone():
    pinecone.init(
        api_key=os.environ["PINECONE_API_KEY"],
        environment=os.environ["PINECONE_ENVIRONMENT"],
    )
    pinecone_index = pinecone.Index("maize")
    pinecone_vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    return pinecone_index, pinecone_vector_store


pinecone_index, pinecone_vector_store = init_pinecone()


def init_index():
    global pinecone_vector_store

    storage_context = StorageContext.from_defaults(
        vector_store=pinecone_vector_store,
    )
    index = VectorStoreIndex.from_documents([], storage_context=storage_context)
    return storage_context, index


storage_context, index = init_index()


@app.route("/", methods=["GET"])
def home():
    return "Home", 200


@app.route("/api/query", methods=["GET"])
def query_index():
    query_text = request.args.get("text", None)

    if query_text is None:
        return "No text found, please include a ?text=SIUUU parameter in the URL", 400

    response = index.as_query_engine().query(query_text)

    return {
        "success": True,
        "message": "Success querying!",
        "payload": {
            "response": response.response,  # type: ignore
            "source_nodes": response.source_nodes,
        },
    }, 200


@app.route("/api/createKernel", methods=["POST"])
def createKernel():
    global index, storage_context

    file = request.files.get("file")
    if file is None:
        return {"success": False, "message": "File required"}, 400

    # Temporarily save the file in the temp directory to read its contents
    temp_file_path = os.path.join(os.environ["TEMP_DIR"], file.filename)  # type: ignore
    file.save(temp_file_path)
    temp_reader = open(temp_file_path, "r")
    file_content = temp_reader.read()

    # Create document and insert into index
    doc = Document(file_content)
    index.insert(doc)
    doc_id = doc.get_doc_id()

    # Remove the temp file from the temp directory
    os.remove(temp_file_path)

    # open existing map of files
    files_db_reader = open(os.environ["FILES_DB"], "r")
    files_db = json.load(files_db_reader)

    # Connect generated doc_id to user_specified filepath
    files_db[doc_id] = {"filename": file.filename}

    # Save the file in the actual directory
    file_path = os.path.join(os.environ["GRANARY_DIR"], doc_id + ".txt")  # type: ignore
    file.save(file_path)

    # Write to the map of files
    files_db_writer = open(os.environ["FILES_DB"], "w")
    json.dump(files_db, files_db_writer)

    return {
        "success": True,
        "message": "Success creating kernel!",
        "payload": {},
    }, 200


if __name__ == "__main__":
    app.run(port=PORT)
