from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from models import IngestRequest, IngestResponse, QuestionRequest, QuestionResponse
from vector_store import VectorStore
from llm_service import LLMService
from utils import extract_text_from_pdf, extract_text_from_txt, chunk_text

load_dotenv()

app = FastAPI(
    title="Document Q&A RAG API",
    description="Upload documents and ask questions based on their content",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_store = VectorStore()
llm_service = LLMService()

@app.get("/")
async def root():
    
    return {
        "status": "running",
        "message": "Document Q&A RAG API is running",
        "endpoints": {
            "POST /ingest/text": "Ingest text directly",
            "POST /ingest/file": "Ingest PDF or TXT file",
            "POST /ask": "Ask questions about ingested documents"
        }
    }

@app.post("/ingest/text", response_model=IngestResponse)
async def ingest_text(request: IngestRequest):
  
    try:
        if not request.text or len(request.text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        chunks = chunk_text(request.text)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="Failed to create chunks from text")
        
        num_chunks = vector_store.add_documents(chunks)
        
        return IngestResponse(
            message="Text ingested successfully",
            chunks_created=num_chunks
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ingesting text: {str(e)}")

@app.post("/ingest/file", response_model=IngestResponse)
async def ingest_file(file: UploadFile = File(...)):
   
    try:
        if file.content_type not in ["application/pdf", "text/plain"]:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and TXT files are supported"
            )
        
        if file.content_type == "application/pdf":
            text = extract_text_from_pdf(file)
        else:  
            text = extract_text_from_txt(file)
        
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No text could be extracted from file")
        
        
        chunks = chunk_text(text)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="Failed to create chunks from text")
        
        num_chunks = vector_store.add_documents(chunks)
        
        return IngestResponse(
            message=f"File '{file.filename}' ingested successfully",
            chunks_created=num_chunks
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
   
    try:
        if not request.question or len(request.question.strip()) == 0:
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        context_chunks = vector_store.search(request.question, top_k=3)
        
        if not context_chunks:
            return QuestionResponse(
                answer="I don't know - no documents have been ingested yet.",
                context_used=[]
            )
        
        answer = llm_service.generate_answer(request.question, context_chunks)
        
        return QuestionResponse(
            answer=answer,
            context_used=context_chunks
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.post("/reset")
async def reset_database():
   
    try:
        vector_store.reset()
        return {"message": "Database reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting database: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)