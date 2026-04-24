import React from 'react';
import { FileText } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <FileText size={40} className="header-icon" />
          <h1>Document Q&A Assistant</h1>
        </div>
        <p className="header-subtitle">
          Upload documents and ask questions - powered by RAG & AI
        </p>
      </div>
    </header>
  );
};

export default Header;