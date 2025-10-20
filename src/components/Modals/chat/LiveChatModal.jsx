// FILE: src/components/Modals/chat/LiveChatModal.jsx
// PURPOSE: Live chat modal for customers to send SMS messages to live agent

import React, { useState } from 'react';
import ringCentralService from '../../../services/ringCentralService';
import Portal from './Portal';

const LiveChatModal = ({ customerData, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const messageData = {
        customerName: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Anonymous',
        customerPhone: customerData.phone || 'Not provided',
        customerEmail: customerData.email || 'Not provided',
        message: message.trim()
      };

      await ringCentralService.sendMessage(messageData);

      // Add message to local history
      setMessages([...messages, {
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString(),
        sent: true
      }]);

      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Portal>
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'white',
      zIndex: 1000000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}
    >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #004085 0%, #0056b3 100%)',
          color: 'white',
          padding: '20px 30px',
          
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>
              💬 Live Chat
            </h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              Message our team directly
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: 'white',
              padding: '0',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              lineHeight: '28px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ×
          </button>
        </div>

        {/* Customer Info */}
        <div style={{
          padding: '15px 30px',
          background: '#f8f9fa',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '14px',
          color: '#666'
        }}>
          <strong>Your Info:</strong> {customerData.firstName} {customerData.lastName}
          {customerData.phone && ` • ${customerData.phone}`}
          {customerData.email && ` • ${customerData.email}`}
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          padding: '20px 30px',
          overflowY: 'auto',
          background: '#f8f9fa'
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                Start a conversation with our team
              </p>
              <p style={{ fontSize: '14px' }}>
                Your messages will be sent as SMS to our business phone
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: msg.sent ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: msg.sent ? 'linear-gradient(135deg, #004085 0%, #0056b3 100%)' : '#e2e8f0',
                  color: msg.sent ? 'white' : '#333'
                }}>
                  <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    textAlign: 'right'
                  }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))
          )}

          {error && (
            <div style={{
              background: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '10px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #e2e8f0',
          background: 'white',
          
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              disabled={isSending}
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'none',
                minHeight: '60px',
                maxHeight: '120px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#004085'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              style={{
                padding: '0 20px',
                background: message.trim() && !isSending
                  ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                  : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: message.trim() && !isSending ? 'pointer' : 'not-allowed',
                minWidth: '80px',
                transition: 'all 0.2s',
                boxShadow: message.trim() && !isSending ? '0 4px 12px rgba(40, 167, 69, 0.3)' : 'none'
              }}
            >
              {isSending ? '...' : 'Send'}
            </button>
          </div>
          <div style={{
            marginTop: '10px',
            fontSize: '12px',
            color: '#999',
            textAlign: 'center'
          }}>
            Messages are sent to our business phone at (330) 435-8686
          </div>
        </div>
    </div>
    </Portal>
  );
};

export default LiveChatModal;
