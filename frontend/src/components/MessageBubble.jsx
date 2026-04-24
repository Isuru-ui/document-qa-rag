import React, { useState } from 'react';
import { User, Bot, ChevronDown, ChevronUp } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const [showContext, setShowContext] = useState(false);

  return (
    <div className={`message-bubble ${message.role}`}>
      <div className="message-header">
        {message.role === 'user' ? (
          <User size={20} className="message-icon" />
        ) : (
          <Bot size={20} className="message-icon" />
        )}
        <strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong>
      </div>

      <div className="message-content">
        {message.content}
      </div>

      {message.context && message.context.length > 0 && (
        <div className="context-section">
          <button
            className="context-toggle"
            onClick={() => setShowContext(!showContext)}
          >
            View Context Used
            {showContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showContext && (
            <div className="context-list">
              {message.context.map((ctx, idx) => (
                <div key={idx} className="context-item">
                  <strong>Context {idx + 1}:</strong>
                  <p>{ctx}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;