import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FaPaperPlane, FaUser, FaRobot, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const ChatInterface = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const connect = () => {
    if (!username.trim()) return;
    
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.current = Stomp.over(socket);
    
    stompClient.current.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      setConnected(true);
      
      // Subscribe to the public topic
      stompClient.current.subscribe('/topic/public', (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages(prevMessages => [...prevMessages, receivedMessage]);
      });
      
      // Notify others about the new user
      stompClient.current.send(
        "/app/chat.addUser",
        {},
        JSON.stringify({ 
          sender: username, 
          type: 'JOIN',
          timestamp: new Date().toISOString()
        })
      );
    });
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({ 
          sender: username, 
          type: 'LEAVE',
          content: `${username} left the chat`,
          timestamp: new Date().toISOString()
        })
      );
      stompClient.current.deactivate();
    }
    setConnected(false);
    setMessages([]);
    setUsername('');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !stompClient.current) return;
    
    const chatMessage = {
      sender: username,
      content: message,
      type: 'CHAT',
      timestamp: new Date().toISOString()
    };
    
    stompClient.current.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify(chatMessage)
    );
    
    setMessage('');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="chat-container">
      {!connected ? (
        <div className="login-container">
          <div className="login-box">
            <h2>Welcome to AI Student Companion</h2>
            <p>Enter your name to start chatting with the AI assistant</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && connect()}
              />
              <button onClick={connect} className="connect-btn">
                <FaSignInAlt /> Join Chat
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-app">
          <div className="chat-header">
            <h2>AI Student Companion</h2>
            <button onClick={disconnect} className="disconnect-btn">
              <FaSignOutAlt /> Leave Chat
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.sender === username ? 'sent' : 'received'} ${msg.sender === 'AI Assistant' ? 'ai-message' : ''}`}
              >
                <div className="message-sender">
                  {msg.sender === 'AI Assistant' ? <FaRobot /> : <FaUser />}
                  <span>{msg.sender}</span>
                </div>
                <div className="message-content">{msg.content}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            ))}
            {typing && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <button type="submit" className="send-btn">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
