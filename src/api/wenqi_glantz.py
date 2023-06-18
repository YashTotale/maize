import os
import pinecone
from flask import Flask, request
from llama_index import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    Document,
    StorageContext,
    load_index_from_storage,
)
from llama_index.vector_stores import PineconeVectorStore


PORT = 3001
app = Flask(__name__)

os.environ["STORAGE_DIR"] = "./storage"
os.environ["GRANARY_DIR"] = "./granary"
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
        vector_store=pinecone_vector_store, persist_dir=os.environ["STORAGE_DIR"]
    )

    if os.path.exists(os.environ["STORAGE_DIR"]):
        index = load_index_from_storage(storage_context)  # type: ignore
    else:
        documents = SimpleDirectoryReader(os.environ["GRANARY_DIR"]).load_data()
        index = VectorStoreIndex.from_documents(
            documents, storage_context=storage_context
        )
        storage_context.persist(persist_dir=os.environ["STORAGE_DIR"])

    return storage_context, index


storage_context, index = init_index()


@app.route("/", methods=["GET"])
def home():
    return "Home", 200


@app.route("/api/createKernel", methods=["POST"])
def createKernel():
    global index, storage_context

    file = request.files.get("file")
    if file is None:
        return {"success": False, "message": "File required"}, 400

    file_path = os.path.join(os.environ["GRANARY_DIR"], file.filename)  # type: ignore
    if os.path.exists(file_path):
        return (
            {
                "success": False,
                "message": "This file has already been added to your Granary. Please rename it and upload again.",
            },
            400,
        )

    file.save(file_path)
    saved_file = open(file_path, "r")
    file_content = saved_file.read()

    doc = Document(file_content)
    index.insert(doc)
    index.storage_context.persist(persist_dir=os.environ["STORAGE_DIR"])

    return {
        "success": True,
        "message": "Success creating kernel!",
        "payload": {
            "kernel_id": doc.doc_id,
        },
    }, 200


# granary_dir = "./granary"  # directory to store files
# storage_dir = "./storage"
# html_file = "./example.html"

# storage_context = StorageContext.from_defaults(persist_dir=storage_dir)
# index: VectorStoreIndex = None  # type: ignore
# kindex: KnowledgeGraphIndex = None


# @app.route("/api/query", methods=["GET"])
# def query_index():
#     global index

#     if index is None:
#         return "No index found. Please upload documents to query."

#     query_text = request.args.get("text", None)
#     if query_text is None:
#         return "No text found, please include a ?text=blah parameter in the URL", 400
#     # query_engine = index.as_query_engine()

#     # response = query_engine.query(query_text)

#     print(query_text)

#     # configure retriever
#     retriever = VectorIndexRetriever(
#         index=index,
#         similarity_top_k=4,
#     )

#     # configure response synthesizer
#     response_synthesizer = ResponseSynthesizer.from_args(
#         node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.7)]
#     )

#     # assemble query engine
#     query_engine = RetrieverQueryEngine(
#         retriever=retriever,
#         response_synthesizer=response_synthesizer,
#     )

#     # query
#     response = query_engine.query(query_text)

#     print("SOURCES: " + response.get_formatted_sources())

#     return {
#         "success": True,
#         "message": "Success querying!",
#         "payload": {
#             "response": response.response,  # type: ignore
#             "response_nodes": response.source_nodes,
#         },
#     }, 200


if __name__ == "__main__":
    app.run(port=PORT)
