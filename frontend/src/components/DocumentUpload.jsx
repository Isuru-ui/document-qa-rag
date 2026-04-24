import React, { useState } from 'react';
import { Upload, FileText, AlignLeft } from 'lucide-react';
import { ingestText, ingestFile } from '../services/api';

const DocumentUpload = ({ onDocumentIngested }) => {
  const [activeTab, setActiveTab] = useState('file');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'text/plain') {
        setSelectedFile(file);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: 'Only PDF and TXT files are supported' });
        setSelectedFile(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await ingestFile(selectedFile);
      setMessage({
        type: 'success',
        text: `${result.message} - Created ${result.chunks_created} chunks`
      });
      onDocumentIngested(true);
      setSelectedFile(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error uploading file' });
    } finally {
      setLoading(false);
    }
  };

  const handleTextIngest = async () => {
    if (!textInput.trim()) {
      setMessage({ type: 'error', text: 'Please enter some text first' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await ingestText(textInput);
      setMessage({
        type: 'success',
        text: `${result.message} - Created ${result.chunks_created} chunks`
      });
      onDocumentIngested(true);
      setTextInput('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error ingesting text' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-upload">
      <h2 className="section-title"> Upload Document</h2>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'file' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('file')}
        >
          <FileText size={16} />
          File Upload
        </button>
        <button
          className={`tab ${activeTab === 'text' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <AlignLeft size={16} />
          Text Input
        </button>
      </div>

      {activeTab === 'file' && (
        <div className="tab-content">
          <div className="file-upload-area">
            <input
              type="file"
              id="file-input"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-input" className="file-upload-label">
              <Upload size={32} />
              <p>Choose a PDF or TXT file</p>
              {selectedFile && (
                <span className="selected-file">{selectedFile.name}</span>
              )}
            </label>
          </div>

          <button
            className="primary-button"
            onClick={handleFileUpload}
            disabled={!selectedFile || loading}
          >
            {loading ? 'Processing...' : ' Ingest File'}
          </button>
        </div>
      )}

      {activeTab === 'text' && (
        <div className="tab-content">
          <textarea
            className="text-input-area"
            placeholder="Paste your document text here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={10}
          />

          <button
            className="primary-button"
            onClick={handleTextIngest}
            disabled={!textInput.trim() || loading}
          >
            {loading ? 'Processing...' : ' Ingest Text'}
          </button>
        </div>
      )}

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;