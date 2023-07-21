## Inspiration

The new age of large language models has brought about critical challenges in scalability, namely how to manage and effectively use large, often overwhelming, amounts of data. Typically, whether students using Google Drive, companies using corporate-level OneDrive, or academic researchers sifting through large amounts of unstructured text data, people often find themselves at the helm of much more data than they can possibly use or even comprehend. 

That’s where LLMs come in. With the ability to intelligently manipulate specialized information banks, individuals would be able to accelerate the development of new products and learning of complex material.  We wanted to explore how AI could transform accessible digital storage, an area which has remained relatively stagnant over the past decade. 

In short, having too much information to deal with has become a common challenge in our world. But it should not be—if anything, it should be a superpower, given large amounts of knowledge to make informed decisions with. With LLMs and our new product, Maize, such a reality is now possible. 

## What it does

Put simply, our platform is akin to an efficient, scalable Google Drive with AI-powered querying, searching, transforming, and visualizing. 

Upon visiting our page, users can upload multiple files to be processed. Internally, Maize automatically parses the documents, transforms them into vector embeddings for fast search, and uploads them to our embedding database. 

Next, on the “Granary” page, users can submit a complex query about any of their documents. Within seconds, Maize will provide an intelligent response synthesized across all loaded documents. Moreover, all relevant documents and their highlighted segments will be displayed. 

Moreover, we provide a customizable “Relation Map” page. Here, users can find an intelligently-generated graph of ideas and their relations across all loaded documents, enabling efficient compilation of relevant topics. 

As an example use case, a business could input gigabytes of monolithic documentation and knowledge documents into Maize. These knowledge bases are often confusing, disjointed, and time-consuming to read. With a single query, Maize will intelligently provide a transformed response synthesized across all relevant documents, saving valuable time and energy for employees.

## How we built it

We developed a sleek, intuitive frontend with Next.js, React, Tailwind.css, DaisyUI, and Typescript.  Our intermediary stage was built with Flask and Python, where we built a robust server to handle API endpoints for querying GPT, uploading files, and creating a graphical network visualization of inputted files. 

At the core of our backend is Llama Index, which we use to connect uploaded data to GPT-4. For document queries, we utilize the VectorStoreIndex API, which represents documents as embeddings. The final component of our architecture is a custom Pinecone vector database stored in the cloud. Pinecone enables our application to perform queries in parallel and efficiently compute results.  

Then, to visualize our network, we use pyvis and llama-index’s beta-version knowledge-graph index. Because their knowledge-graph is fundamentally different from what we wanted to create (we wanted to develop a “correlation” graph between sub-nodes of documents), we had to significantly rework their graph creation, which required changing their source code regarding internal map data structures for the graph index as well as for graph visualization itself. 

## Challenges we ran into

Our largest challenge was integration and debugging. Integration was initially problematic because we were merging many different frameworks together, from React to Flask to LLM backend libraries. Though React’s standard practice is for API endpoints to rest in the src/api folder in our local files, we could then not integrate the Python LLM libraries as their own API endpoints at the same time. Hence, we had to host all of the API routes in Flask, which came with its own challenges when coming into conflict with next.js caching at times, which we were able to solve in the last few minutes. 

Another big challenge was generating our custom relationship map graph visualization by reworking llama-index’s source code. For one, llama-index was a new library for us to parse through, let alone customize for our own use. We had to change their knowledge map—which maps subjects to objects with the edges being “relationships” or verbs, to correlations where the vertices were subnodes of documents and classified them by owner document. We then made the edges to be the “ideas” that each sub-node may share, and upon hovering over each vertex, one can see the entire node’s text contents. For fun, pyvis also allows you to move the graph around with simulated physics :D 
	

## Accomplishments that we're proud of

We are very proud of the end-to-end application that we were able to build as well as being able to overcome many technical challenges along the way. Our project involved having to heavily customize the llama-index source code to meet our needs (especially regarding the knowledge graph index library), and it was also great to build an application with cutting-edge large language models, something we hadn’t really done before. Moreover, we were able to integrate many different functions—a Flask server backend connecting to React frontend with a Pinecone vector database and llama-index querying all together in one application. We are proud of our end result both as a functioning application and as a great learning experience with using cutting-edge technology for us as well. 

## What we learned

We learned a lot about LLMs during this hackathon. While we have experience in classical machine learning development, it was exciting to try our hands at developing applications centered around transformer models. Moreover, the chance to delve deep into APIs of services like LlamaIndex, Pinecone, OpenAI, and Langchain was invaluable. We also learned so much about the structure of LLMs and prompt engineering, and as aspiring machine learning developers, we’re truly excited to see how these models completely change how we make new technology in the world, and even how we think and problem-solve as individuals. Thank you for the free credits and for this wonderful opportunity! 
	

## What's next for Maize

Maize plans to integrate more user-friendly features that allow transformation of multiple file types (like PDFs and .docx) into readable and processable text. Additionally, we hope to expand the education applications and scope of our company by allowing users to upload images of text (such as ancient manuscripts stored online), and using image-text processing to incorporate those documents into our Maize granary. 

Fundamentally, we hope that our file management pipeline can act as a centralized hub for students, educators, and the corporate world alike to streamline their document search process and gain contextualized insights and analysis about their data.  Moreover, our website will continue to act as a long-term storage and memory database while also expanding educational tools— by providing accurate, meaningful visualization tools to view relationships ideas in different sources (and discover shared nuances between seemingly disparate concepts), students and educators can use the language-analysis capability of Maize to learn and teach.

We hope to integrate with existing file storage sources on the cloud like Google Drive and Microsoft OneDrive to provide multi-document analytical plugins. In this fashion, we reach a greater audience and allow existing tools to utilize the power of our product, expanding the resources we have access to as we grow Maize into a standalone, solitary silo of strength.
