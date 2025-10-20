// FILE: src/components/Modals/chat/PaymentModal.jsx
// PURPOSE: Modal for collecting payment card information via Square

import React, { useEffect, useState, useRef } from 'react';
import squarePaymentService from '../../../services/squarePaymentService';

const PaymentModal = ({ estimate, customerData, onClose, onPaymentComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardInitialized, setCardInitialized] = useState(false);
  const cardContainerRef = useRef(null);

  useEffect(() => {
    initializeSquareCard();

    return () => {
      // Cleanup on unmount
      squarePaymentService.destroy();
    };
  }, []);

  const initializeSquareCard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await squarePaymentService.initializeCard('square-card-container');
      setCardInitialized(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Card initialization error:', err);
      setError('Failed to load payment form. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSaveCard = async () => {
    if (!cardInitialized) {
      setError('Payment form not ready. Please wait.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Tokenize the card
      const result = await squarePaymentService.tokenizeCard();

      if (result.success) {
        // Send token and customer data to parent component or backend
        if (onPaymentComplete) {
          await onPaymentComplete({
            token: result.token,
            cardDetails: result.details,
            customerData,
            estimate
          });
        }
      } else {
        const errorMessages = result.errors.map(e => e.message).join(', ');
        setError(errorMessages || 'Card validation failed');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            color: '#1a202c',
            fontWeight: '700'
          }}>
            💳 Save Payment Method
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#718096',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Estimate Summary */}
        {estimate && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
              Estimated Total
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>
              ${estimate.total}
            </div>
          </div>
        )}

        {/* Info Text */}
        <div style={{
          background: '#eef2ff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px',
          color: '#4c51bf',
          lineHeight: '1.6'
        }}>
          <strong>🔒 Secure Payment</strong><br />
          Your card will be securely saved for this booking. No charges will be made until after your move is complete.
        </div>

        {/* Card Form Container */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#2d3748'
          }}>
            Card Information
          </label>

          {isLoading ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#718096'
            }}>
              <div style={{ marginBottom: '12px' }}>🔄</div>
              <div>Loading secure payment form...</div>
            </div>
          ) : (
            <div
              id="square-card-container"
              ref={cardContainerRef}
              style={{
                minHeight: '100px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                background: '#f7fafc'
              }}
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fed7d7',
            color: '#c53030',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '14px',
              background: '#e2e8f0',
              color: '#2d3748',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCard}
            disabled={!cardInitialized || isProcessing}
            style={{
              flex: 2,
              padding: '14px',
              background: isProcessing || !cardInitialized
                ? '#cbd5e0'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: (!cardInitialized || isProcessing) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {isProcessing ? '⏳ Processing...' : '💾 Save Card Securely'}
          </button>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#718096',
          textAlign: 'center'
        }}>
          🔐 Secured by Square • PCI Compliant • No card data stored on our servers
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
