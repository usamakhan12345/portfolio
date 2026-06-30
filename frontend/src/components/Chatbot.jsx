import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Minimize2, Maximize2, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Use a constant session ID for simplicity, could be dynamic per device
  const sessionId = 'usama-portfolio-session';
  const messagesEndRef = useRef(null);

  // Backend API Base URL (Configurable in production)
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/chat';

  // Fetch chat history from database on load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/history?sessionId=${sessionId}`);
        if (res.data && res.data.success && res.data.history.length > 0) {
          setMessages(res.data.history);
        } else {
          // Default initial greeting if history is empty
          setMessages([
            {
              sender: 'bot',
              message: "Hi! I'm Usama's AI assistant. I can answer questions about his tech stack, experience, projects, or how to contact him. How can I help you today?",
              timestamp: new Date()
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching chat history, using default greeting:', error.message);
        setMessages([
          {
            sender: 'bot',
            message: "Hi! I'm Usama's AI assistant. I can answer questions about his tech stack, experience, projects, or how to contact him. How can I help you today?",
            timestamp: new Date()
          }
        ]);
      }
    };

    fetchHistory();
  }, []);

  // Auto scroll to bottom when messages list changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    // Add user message to state
    const userMessage = { sender: 'user', message: userText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);

    // Show typing state
    setIsTyping(true);

    try {
      // Post to Express backend
      const response = await axios.post(API_BASE_URL, {
        message: userText,
        sessionId
      });

      setIsTyping(false);

      if (response.data && response.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            message: response.data.message,
            timestamp: response.data.timestamp || new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Error communicating with chatbot API, playing back offline replies:', error);
      
      // Fallback answers in case server is offline
      setTimeout(() => {
        setIsTyping(false);
        let fallbackText = "I'm having trouble connecting to my backend server right now. However, you can contact Usama directly at 03162920295 or through the Contact form below!";
        
        const q = userText.toLowerCase();
        if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
          fallbackText = "Hello! How can I help you? (Offline Mode)";
        } else if (q.includes('skill') || q.includes('tech') || q.includes('expert')) {
          fallbackText = "Usama is a MERN Stack Developer proficient in React, NodeJS, Express, MongoDB, and SCSS stylesheets.";
        } else if (q.includes('contact') || q.includes('whatsapp') || q.includes('phone')) {
          fallbackText = "You can reach Usama at 03162920295 or on WhatsApp using the floating green button in the corner!";
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            message: fallbackText,
            timestamp: new Date()
          }
        ]);
      }, 1000);
    }
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Convert markdown-like syntax to bold/links
  const renderMessageContent = (text) => {
    // Basic formatting helper for bold text (**text**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    const bulletRegex = /^-\s(.*)/gm;
    const telRegex = /\[(.*?)\]\(tel:(.*?)\)/g;

    let html = text
      .replace(boldRegex, '<strong>$1</strong>')
      .replace(telRegex, '<a href="tel:$2" class="chat-link">$1</a>')
      .replace(bulletRegex, '• $1');

    return <div dangerouslySetInnerHTML={{ __html: html.split('\n').map(line => `<p>${line}</p>`).join('') }} />;
  };

  return (
    <>
      {/* Floating Bubble Button */}
      <button
        className="chatbot-float"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chatbot Support"
        title="Chat with AI Assistant"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chatbot Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`chatbot-panel ${isMaximized ? 'maximized' : ''}`}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="bot-info">
                <div className="bot-avatar">
                  <Bot size={20} />
                  <span className="online-dot"></span>
                </div>
                <div className="bot-details">
                  <h4>Usama Assistant</h4>
                  <span>Online | AI Bot</span>
                </div>
              </div>

              <div className="chat-controls">
                <button 
                  onClick={() => setIsMaximized(!isMaximized)} 
                  title={isMaximized ? "Minimize window size" : "Maximize window size"}
                >
                  {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  title="Close chat window"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`msg-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                  <div className="msg-bubble">
                    {renderMessageContent(msg.message)}
                  </div>
                  <span className="msg-time">{formatTime(msg.timestamp)}</span>
                </div>
              ))}

              {/* Typing Loader Indicator */}
              {isTyping && (
                <div className="msg-row bot">
                  <div className="msg-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <div className="chat-footer">
              <form onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Ask me something about Usama..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                />
                <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
