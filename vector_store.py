import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List
import os

class VectorStore:
    def __init__(self):
        self.client = chromadb.Client(Settings(
            anonymized_telemetry=False,
            allow_reset=True
        ))
        
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )
        
        model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
        self.embedding_model = SentenceTransformer(model_name)
        
        print(f" Vector store initialized with model: {model_name}")
    
    def add_documents(self, chunks: List[str]) -> int:
      
        if not chunks:
            return 0
      
        embeddings = self.embedding_model.encode(chunks).tolist()
        
      
        ids = [f"chunk_{i}" for i in range(len(chunks))]
      
        self.collection.delete(ids=ids)
        
        self.collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=ids
        )
        
        return len(chunks)
    
    def search(self, query: str, top_k: int = 3) -> List[str]:
    
        query_embedding = self.embedding_model.encode([query]).tolist()
        
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=top_k
        )
        
        if results and results['documents']:
            return results['documents'][0]
        return []
    
    def reset(self):
        self.client.reset()
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )