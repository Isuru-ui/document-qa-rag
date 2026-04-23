import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List
import os

class VectorStore:
    def __init__(self):
        """Initialize ChromaDB and embedding model"""
        # ChromaDB setup (in-memory for lightweight deployment)
        self.client = chromadb.Client(Settings(
            anonymized_telemetry=False,
            allow_reset=True
        ))
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )
        
        # Load lightweight embedding model
        model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
        self.embedding_model = SentenceTransformer(model_name)
        
        print(f"✅ Vector store initialized with model: {model_name}")
    
    def add_documents(self, chunks: List[str]) -> int:
        """Add document chunks to vector store"""
        if not chunks:
            return 0
        
        # Generate embeddings
        embeddings = self.embedding_model.encode(chunks).tolist()
        
        # Create IDs for chunks
        ids = [f"chunk_{i}" for i in range(len(chunks))]
        
        # Clear existing documents (for simplicity - replace with upsert in production)
        self.collection.delete(ids=ids)
        
        # Add to ChromaDB
        self.collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=ids
        )
        
        return len(chunks)
    
    def search(self, query: str, top_k: int = 3) -> List[str]:
        """Search for relevant chunks based on query"""
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query]).tolist()
        
        # Search in ChromaDB
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=top_k
        )
        
        # Extract documents
        if results and results['documents']:
            return results['documents'][0]
        return []
    
    def reset(self):
        """Clear all documents from vector store"""
        self.client.reset()
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )