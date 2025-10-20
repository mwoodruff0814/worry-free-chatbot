// FILE: src/components/Modals/chat/ChatSidebar.jsx
// PURPOSE: Sidebar with quick actions (call, FAQ, save quote, live chat)

import React, { useState } from 'react';

const ChatSidebar = ({ onSaveQuote, onStartOver, customerData = {} }) => {
  const [showFAQ, setShowFAQ] = useState(false);

  const handleCall = () => {
    window.open('tel:330-435-8686', '_self');
  };

  const handleSMS = () => {
    window.open('sms:330-435-8686', '_self');
  };

  const faqs = [
    {
      q: "What areas do you serve?",
      a: "We proudly serve Northeast Ohio including Youngstown, Warren, Akron, Canton, and surrounding areas within 150 miles."
    },
    {
      q: "How is pricing calculated?",
      a: "Local moves (under 30 miles): Hourly rate based on crew size. Long distance (30+ miles): Fixed minimum quote plus hourly overages if needed."
    },
    {
      q: "What's included in the service?",
      a: "Professional crew, moving truck, fuel, equipment (dollies, straps, blankets), and basic liability coverage."
    },
    {
      q: "Do you pack items?",
      a: "Yes! We offer full packing, partial packing (fragile items), or just packing supplies."
    },
    {
      q: "Can I reschedule?",
      a: "Yes! Contact us at 330-435-8686 to reschedule. We understand plans change!"
    },
    {
      q: "Are you insured?",
      a: "Yes! We're fully licensed and insured. We offer standard coverage ($0.60/lb) and Full Value Protection."
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
      padding: '6px 12px',
      background: '#f8f9fa',
      borderTop: '1px solid #e2e8f0',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      {/* Call Button */}
      <button
        onClick={handleCall}
        title="Call us: 330-435-8686"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(40, 167, 69, 0.4)',
          transition: 'all 0.3s',
          color: 'white',
          fontSize: '20px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
        }}
      >
        📞
      </button>


      {/* SMS Button */}
      <button
        onClick={handleSMS}
        title="Text us: 330-435-8686"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(111, 66, 193, 0.4)',
          transition: 'all 0.3s',
          color: 'white',
          fontSize: '20px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(111, 66, 193, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.4)';
        }}
      >
        💬
      </button>

      {/* FAQ Button */}
      <button
        onClick={() => setShowFAQ(!showFAQ)}
        title="Frequently Asked Questions"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 123, 255, 0.4)',
          transition: 'all 0.3s',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
        }}
      >
        ?
      </button>

      {/* Start Over Button */}
      <button
        onClick={onStartOver}
        title="Start Over"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
          transition: 'all 0.3s',
          color: 'white',
          fontSize: '20px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
        }}
      >
        🔄
      </button>

      {/* Save Quote Button */}
      <button
        onClick={onSaveQuote}
        title="Save your quote"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(255, 193, 7, 0.4)',
          transition: 'all 0.3s',
          color: 'white',
          fontSize: '20px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(255, 193, 7, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.4)';
        }}
      >
        💾
      </button>


      {/* FAQ Modal */}
      {showFAQ && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'white',
          zIndex: 1000000,
          overflowY: 'auto',
          padding: '20px'
        }}
        >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{ margin: 0, fontSize: '28px', color: '#333' }}>❓ Frequently Asked Questions</h2>
              <button
                onClick={() => setShowFAQ(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0',
                  width: '32px',
                  height: '32px'
                }}
              >
                ×
              </button>
            </div>

            {faqs.map((faq, index) => (
              <div key={index} style={{
                marginBottom: '22px',
                padding: '20px',
                background: '#f8fafb',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#333', fontWeight: '600' }}>
                  {faq.q}
                </h3>
                <p style={{ margin: 0, fontSize: '16px', color: '#666', lineHeight: '1.7' }}>
                  {faq.a}
                </p>
              </div>
            ))}

            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#e8f5e9',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#2e7d32' }}>
                Still have questions?
              </p>
              <button
                onClick={handleCall}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📞 Call 330-435-8686
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
