from pydantic import BaseModel
from typing import Optional

class IngestRequest(BaseModel):
    """Request model for document ingestion"""
    text: Optional[str] = None
    
class IngestResponse(BaseModel):
    """Response model for document ingestion"""
    message: str
    chunks_created: int
    
class QuestionRequest(BaseModel):
    """Request model for asking questions"""
    question: str
    
class QuestionResponse(BaseModel):
    """Response model for answers"""
    answer: str
    context_used: list[str]