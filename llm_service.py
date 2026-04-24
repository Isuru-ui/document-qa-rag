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
        
        print(f" LLM service initialized with model: {self.model}")
    
    def generate_answer(self, question: str, context_chunks: List[str]) -> str:
        
        context = "\n\n".join(context_chunks)
        
        system_prompt = """You are a STRICT document Q&A assistant. You MUST follow these rules WITHOUT EXCEPTION:

RULES (ABSOLUTELY MANDATORY):
1. Answer ONLY if the EXACT answer exists in the provided CONTEXT
2. If the context does not EXPLICITLY mention the answer, you MUST respond with EXACTLY: "I don't know"
3. DO NOT use any external knowledge, assumptions, or inferences
4. DO NOT make educated guesses
5. DO NOT provide partial answers if the full answer is not in context
6. If you are even 1% unsure, respond with: "I don't know"

Your ONLY job is to extract answers from the context. If it's not there, say "I don't know"."""

        user_prompt = f"""CONTEXT (Your ONLY source of information):
---
{context}
---

QUESTION: {question}


ANSWER:"""
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ],
                temperature=0.0,  
                max_tokens=300,
                top_p=0.95,
                frequency_penalty=0.0,
                presence_penalty=0.0,
                stop=None
            )
            
            answer = completion.choices[0].message.content.strip()
            
          
            if len(answer) > 500:
                return "I don't know"
            
            external_indicators = [
                "in general",
                "typically",
                "usually",
                "commonly",
                "generally speaking",
                "it is well known",
                "as we know",
                "traditionally"
            ]
            
            answer_lower = answer.lower()
            for indicator in external_indicators:
                if indicator in answer_lower:
                    return "I don't know"
            
            return answer
            
        except Exception as e:
            return f"Error generating answer: {str(e)}"