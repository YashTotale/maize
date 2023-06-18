import os
from llama_index import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    ListIndex,
    Document,
    StorageContext,
    load_index_from_storage,
    node_parser,
    LLMPredictor,
    ServiceContext,
    ResponseSynthesizer,
    EmptyIndex,
)


from flask import request
from langchain.llms import OpenAI
from llama_index.retrievers import VectorIndexRetriever
from llama_index.query_engine import RetrieverQueryEngine
from llama_index.indices.postprocessor import SimilarityPostprocessor

from flask import Flask


PORT = 5000
app = Flask(__name__)

# NOTE: for local testing only, do NOT deploy with your key hardcoded
# kailash's: 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
# sasvath's api key: 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
# sasvath's second api key: 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
os.environ["OPENAI_API_KEY"] = "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"

granary_dir = "./granary"  # directory to store files
storage_dir = "./storage"

storage_context = StorageContext.from_defaults(persist_dir=storage_dir)
index: VectorStoreIndex = None  # type: ignore


@app.before_request
def before_request():
    global index, storage_context
    print(storage_context.index_store.index_structs())

    if os.path.exists(storage_dir):
        index = load_index_from_storage(storage_context)  # type: ignore
    else:
        documents = SimpleDirectoryReader(granary_dir).load_data()
        index = VectorStoreIndex.from_documents(
            documents, storage_context=storage_context
        )
        storage_context.persist(persist_dir=storage_dir)


# filename_fn = lambda filename: {"file_name": filename}
# documents = SimpleDirectoryReader("./granary", filename_as_id=True).load_data()
# assert len(documents) == 2

# # index = VectorStoreIndex.from_documents(documents)
# parser = node_parser.SimpleNodeParser()
# nodes = parser.get_nodes_from_documents(documents)

# llm_predictor = LLMPredictor(llm=OpenAI(model_name="gpt-4"))
# service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)

# index = VectorStoreIndex(nodes, service_context=service_context)
# storage_context.docstore.add_documents(nodes)


@app.route("/")
def home():
    return "Welcome to the Maize API. Use /api/ to call API routes."


@app.route("/api/")
def home2():
    return "nice"


@app.route("/api/createKernel", methods=["POST"])
def createKernel():
    global index, storage_context

    file = request.files.get("file")
    if file is None:
        return "File required", 400

    file_path = os.path.join(granary_dir, file.filename)  # type: ignore
    file.save(file_path)
    saved_file = open(file_path, "r")
    file_content = saved_file.read()

    doc = Document(file_content)
    index.insert(doc)
    index.storage_context.persist(persist_dir=storage_dir)

    response = {"kernel_id": doc.get_doc_id()}
    return response, 200


@app.route("/api/query", methods=["GET"])
def query_index():
    global index

    if index is None:
        return "No index found. Please upload documents to query."

    query_text = request.args.get("text", None)
    if query_text is None:
        return "No text found, please include a ?text=blah parameter in the URL", 400
    # query_engine = index.as_query_engine()

    # response = query_engine.query(query_text)

    print(query_text)

    # configure retriever
    retriever = VectorIndexRetriever(
        index=index,
        similarity_top_k=4,
    )

    # configure response synthesizer
    response_synthesizer = ResponseSynthesizer.from_args(
        node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.7)]
    )

    # assemble query engine
    query_engine = RetrieverQueryEngine(
        retriever=retriever,
        response_synthesizer=response_synthesizer,
    )

    # query
    response = query_engine.query(query_text)

    return {"response": response.response, "response_nodes": response.source_nodes}, 200  # type: ignore


if __name__ == "__main__":
    # index_init()
    app.run(host="0.0.0.0", port=PORT)
