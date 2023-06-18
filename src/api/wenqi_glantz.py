import os
import pinecone
import tempfile
from flask import Flask, request
from llama_index import (
    VectorStoreIndex,
    Document,
    StorageContext,
    ResponseSynthesizer,
)

from llama_index.retrievers import VectorIndexRetriever
from llama_index.query_engine import RetrieverQueryEngine
from llama_index.indices.postprocessor import SimilarityPostprocessor

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
os.environ["SEARCH_THRESHOLD"] = "0.76"


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


# Given a doc_id, returns the text of the document
def get_granary_text(doc_id):
    doc_path = os.path.join(os.environ["GRANARY_DIR"], doc_id + ".txt")
    granary_reader = open(doc_path, "r")
    file_content = granary_reader.read()

    return file_content


# Given a doc_id, get the corresopnding name using the db.json file
def query_files_db(doc_id):
    files_db_reader = open(os.environ["FILES_DB"], "r")
    files_db = json.load(files_db_reader)

    return files_db[doc_id]


@app.route("/api/granary", methods=["GET"])
def query_index():
    query_text = request.args.get("query", None)

    # If no query, then get all documents.
    if query_text is None or query_text == "":
        # Get files database
        files_db_reader = open(os.environ["FILES_DB"], "r")
        files_db = json.load(files_db_reader)

        # Create version of files that has full text appended as an attribute for each file
        for doc_id in files_db:
            #' Read full text and assign to 'text' attribute'
            files_db[doc_id]["text"] = get_granary_text(doc_id)

        return {
            "success": True,
            "message": "Success querying!",
            "payload": {"relevantDocs": files_db},
        }, 200

    else:
        # Define empty response
        relevant_docs = {}

        # GET THE QUERY RESPONSE

        # configure retriever
        retriever = VectorIndexRetriever(
            index=index,
            similarity_top_k=4,
        )

        # configure response synthesizer
        response_synthesizer = ResponseSynthesizer.from_args(
            node_postprocessors=[
                SimilarityPostprocessor(
                    similarity_cutoff=float(os.environ["SEARCH_THRESHOLD"])
                )
            ]
        )

        # assemble query engine
        query_engine = RetrieverQueryEngine(
            retriever=retriever,
            response_synthesizer=response_synthesizer,
        )

        # If query text given, provide the query response
        query_res = query_engine.query(query_text)

        # store only the text of the query response
        text_res = query_res.response  # type: ignore

        # Go through each document that the response used as a source
        nodes = query_res.source_nodes

        for obj in nodes:
            node = obj.node
            # If node is relevant enough...
            if obj.score >= float(os.environ["SEARCH_THRESHOLD"]):  # type: ignore
                # Read text of the node
                text = get_granary_text(node.ref_doc_id)

                # Get filename corresponding to doc_id
                filename = query_files_db(node.ref_doc_id)["filename"]

                # Add object to relevantDocs object with its filename and full text
                relevant_docs[node.ref_doc_id] = {
                    "filename": filename,
                    "text": text,
                }

        return {
            "success": True,
            "message": "Success querying!",
            "payload": {
                "relevantDocs": relevant_docs,  # type: ignore
                "textResponse": text_res,
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
    file_writer = open(file_path, "w")
    file_writer.write(file_content)

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
