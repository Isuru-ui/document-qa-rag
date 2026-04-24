import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, Trash2, RotateCcw, Lightbulb, FileText } from 'lucide-react';
import { checkHealth, resetDatabase } from '../services/api';

const Sidebar = ({ documentIngested, onReset, onClearChat }) => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
        setApiStatus('connected');
      } catch (error) {
        setApiStatus('offline');
      }
    };


    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the database?')) {
      try {
        await resetDatabase();
        onReset();
        alert('Database reset successfully!');
      } catch (error) {
        alert('Error resetting database');
      }
    }
  };

  return (
    <aside className="sidebar">


      <div className="sidebar-divider"></div>

      <div className="sidebar-section">
        <h3 className="sidebar-title"> Status</h3>

        <div className="status-item">
          <Activity size={16} />
          <span>API Status:</span>
          {apiStatus === 'connected' && (
            <span className="status-badge status-success">
              <CheckCircle size={14} /> Connected
            </span>
          )}
          {apiStatus === 'offline' && (
            <span className="status-badge status-error">
              <XCircle size={14} /> Offline
            </span>
          )}
          {apiStatus === 'checking' && (
            <span className="status-badge status-warning">Checking...</span>
          )}
        </div>

        <div className="status-item">
          <FileText size={16} />
          <span>Document:</span>
          {documentIngested ? (
            <span className="status-badge status-success">
              <CheckCircle size={14} /> Loaded
            </span>
          ) : (
            <span className="status-badge status-warning">
              <XCircle size={14} /> None
            </span>
          )}
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-section">
        <button className="sidebar-button" onClick={onClearChat}>
          <Trash2 size={16} />
          Clear Conversation
        </button>

        <button className="sidebar-button" onClick={handleReset}>
          <RotateCcw size={16} />
          Reset Database
        </button>
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <Lightbulb size={16} /> Tips
        </h3>
        <ul className="tips-list">
          <li>Upload a document first</li>
          <li>Ask questions about it</li>
          <li>Get context-based answers</li>

        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;