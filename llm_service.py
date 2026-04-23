import os
from groq import Groq
from typing import List

class LLMService:
    def __init__(self):
        
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"  
        
        print(f"✅ LLM service initialized with model: {self.model}")
    
    def generate_answer(self, question: str, context_chunks: List[str]) -> str:
        
        
        context = "\n\n".join(context_chunks)
        
        prompt = f"""You are a precise Q&A assistant. 

CONTEXT:
{context}

QUESTION: {question}

ANSWER:"""
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that answers questions strictly based on provided context."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,  
                max_tokens=500,
                top_p=1,
                stream=False
            )
            
            answer = completion.choices[0].message.content.strip()
            return answer
            
        except Exception as e:
            return f"Error generating answer: {str(e)}"