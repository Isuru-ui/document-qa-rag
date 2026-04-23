from pydantic import BaseModel
from typing import Optional

class IngestRequest(BaseModel):
    text: Optional[str] = None
    
class IngestResponse(BaseModel):
    message: str
    chunks_created: int
    
class QuestionRequest(BaseModel):
    question: str
    
class QuestionResponse(BaseModel):
    answer: str
    context_used: list[str]