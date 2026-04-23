import os
from groq import Groq
from typing import List

class LLMService:
    def __init__(self):
        """Initialize Groq LLM client"""
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"  # Fast and free
        
        print(f"✅ LLM service initialized with model: {self.model}")
    
    def generate_answer(self, question: str, context_chunks: List[str]) -> str:
        """Generate answer based on retrieved context"""
        
        # Combine context chunks
        context = "\n\n".join(context_chunks)
        
        # Create prompt with strict instructions
        prompt = f"""You are a precise Q&A assistant. Follow these rules strictly:

1. Answer ONLY using the context provided below
2. If the context doesn't contain the answer, respond EXACTLY with: "I don't know"
3. Do not use any external knowledge or make assumptions
4. Keep answers concise and accurate
5. Quote specific parts of the context when possible

CONTEXT:
{context}

QUESTION: {question}

ANSWER:"""
        
        try:
            # Call Groq API
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
                temperature=0.3,  # Low temperature for more factual responses
                max_tokens=500,
                top_p=1,
                stream=False
            )
            
            answer = completion.choices[0].message.content.strip()
            return answer
            
        except Exception as e:
            return f"Error generating answer: {str(e)}"