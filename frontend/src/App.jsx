import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentUpload from './components/DocumentUpload';
import ChatInterface from './components/ChatInterface';

function App() {
  const [documentIngested, setDocumentIngested] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleReset = () => {
    setDocumentIngested(false);
    setMessages([]);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app">
      <Header />

      <div className="app-container">
        <Sidebar
          documentIngested={documentIngested}
          onReset={handleReset}
          onClearChat={handleClearChat}
        />

        <main className="main-content">
          <div className="content-grid">
            <div className="grid-item">
              <DocumentUpload onDocumentIngested={setDocumentIngested} />
            </div>

            <div className="grid-item">
              <ChatInterface
                documentIngested={documentIngested}
                messages={messages}
                setMessages={setMessages}
              />
            </div>
          </div>
        </main>
      </div>

      <footer className="footer">
        <p>
          Built with using FastAPI, ChromaDB, LangChain & Groq |
          <a href="https://github.com/YOUR_USERNAME/document-qa-rag" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;