# Document QA RAG API

A FastAPI-based document question-answering system using Retrieval-Augmented Generation (RAG) with ChromaDB for vector storage and Groq LLM for answer generation.

## Architecture

```
document-qa-rag/
├── main.py              # Main FastAPI application
├── models.py            # Pydantic models
├── vector_store.py      # ChromaDB logic
├── llm_service.py       # Groq LLM logic
├── utils.py             # Helper functions
├── .env                 # API keys
├── .gitignore
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Add your Groq API key to `.env`:

```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [https://console.groq.com/](https://console.groq.com/)

### 3. Run the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/upload` | Upload a document (PDF/TXT) |
| `POST` | `/ask` | Ask a question about uploaded documents |
| `GET` | `/collections` | List all collections |
| `DELETE` | `/collections/{name}` | Delete a collection |

### Upload a Document

```bash
curl -X POST "http://localhost:8000/upload" \
  -F "file=@document.pdf" \
  -F "collection_name=my_docs"
```

### Ask a Question

```bash
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this document about?", "collection_name": "my_docs"}'
```

## Interactive Docs

Visit `http://localhost:8000/docs` for the Swagger UI.
