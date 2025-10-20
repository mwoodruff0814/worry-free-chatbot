// FILE: src/components/Modals/chat/EstimateCard.jsx
// PURPOSE: Display estimate as a clickable card in the chat

import React, { useState } from 'react';

const EstimateCard = ({ estimate, serviceType }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!estimate) return null;

  const handleClick = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Compact Card in Chat */}
      <div
        onClick={handleClick}
        style={{
          background: 'linear-gradient(135deg, #004085 0%, #0056b3 100%)',
          borderRadius: '15px',
          padding: '20px',
          margin: '10px 0',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 64, 133, 0.3)',
          transition: 'all 0.3s',
          maxWidth: '80%',
          color: 'white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 64, 133, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 64, 133, 0.3)';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            💰 Your Estimate
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            Click to expand
          </div>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
          ${estimate.total || 'TBD'}
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          {serviceType === 'moving' && 'Full Moving Service'}
          {serviceType === 'labor' && 'Labor Only Service'}
          {serviceType === 'single' && 'Single Item Move'}
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#004085' }}>
                  💰 Your Moving Estimate
                </h2>
                <button
                  onClick={handleClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '28px',
                    cursor: 'pointer',
                    color: '#666',
                    padding: 0,
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Service Type */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Service Type</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                {serviceType === 'moving' && '🚚 Full Moving Service'}
                {serviceType === 'labor' && '💪 Labor Only Service'}
                {serviceType === 'single' && '📦 Single Item Move'}
              </div>
            </div>

            {/* Estimate Breakdown */}
            <div style={{ background: '#f8fafb', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                Estimate Breakdown
              </div>

              {estimate.baseRate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span>Base Rate ({estimate.hours || 0} hours × {estimate.crewSize || 0} crew)</span>
                  <span style={{ fontWeight: '600' }}>${estimate.baseRate}</span>
                </div>
              )}

              {estimate.travelFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span>Travel Fee ({estimate.distance || 0} miles)</span>
                  <span style={{ fontWeight: '600' }}>${estimate.travelFee}</span>
                </div>
              )}

              {estimate.stairsFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span>Stairs Fee</span>
                  <span style={{ fontWeight: '600' }}>${estimate.stairsFee}</span>
                </div>
              )}

              {estimate.packingFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span>Packing Service</span>
                  <span style={{ fontWeight: '600' }}>${estimate.packingFee}</span>
                </div>
              )}

              <div style={{ borderTop: '2px solid #e2e8f0', marginTop: '15px', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#004085' }}>
                  <span>Total Estimate</span>
                  <span>${estimate.total || 'TBD'}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', padding: '15px', background: '#fff5e6', borderRadius: '8px' }}>
              <strong>💡 Important:</strong> This is an estimate based on the information provided. Final pricing may vary based on actual conditions, items, and time required. All moves have a 2-hour minimum.
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                background: 'linear-gradient(135deg, #004085 0%, #0056b3 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EstimateCard;
