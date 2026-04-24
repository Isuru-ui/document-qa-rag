import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { askQuestion } from '../services/api';
import MessageBubble from './MessageBubble';

const ChatInterface = ({ documentIngested, messages, setMessages }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMemory, setUseMemory] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (!documentIngested) {
      alert('Please upload a document first');
      return;
    }

    const userMessage = {
      role: 'user',
      content: question,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      let enhancedQuestion = question;

      if (useMemory && messages.length > 0) {
        const conversationHistory = messages
          .filter((_, idx) => idx >= Math.max(0, messages.length - 6))
          .map(msg => `${msg.role === 'user' ? 'Q' : 'A'}: ${msg.content}`)
          .join('\n');

        enhancedQuestion = `Previous conversation:\n${conversationHistory}\n\nCurrent question: ${question}`;
      }

      const result = await askQuestion(enhancedQuestion);

      const assistantMessage = {
        role: 'assistant',
        content: result.answer,
        context: result.context_used || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
      setQuestion('');
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to get answer'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <div className="chat-interface">
      <h2 className="section-title"> Ask Questions</h2>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Upload a document and start asking questions!</p>
          </div>
        ) : (
          <>
            <h3 className="conversation-title"> Conversation History</h3>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="input-section">
        <input
          type="text"
          className="question-input"
          placeholder="What would you like to know about the document?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <button
          className="send-button"
          onClick={handleAskQuestion}
          disabled={loading || !question.trim()}
        >
          {loading ? 'Thinking...' : <><Send size={16} /> Ask</>}
        </button>
      </div>

      <div className="memory-toggle">
        <label>
          <input
            type="checkbox"
            checked={useMemory}
            onChange={(e) => setUseMemory(e.target.checked)}
          />
          <span>Use Conversation Memory</span>
        </label>
      </div>
    </div>
  );
};

export default ChatInterface;