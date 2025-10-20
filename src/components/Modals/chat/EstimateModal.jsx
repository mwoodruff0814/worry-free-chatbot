// FILE: src/components/Modals/chat/EstimateModal.jsx
// PURPOSE: Display estimate as a modal popup with action buttons

import React, { useEffect } from 'react';

const EstimateModal = ({ estimate, serviceType, onClose, onEmailEstimate, onBookNow }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  if (!estimate) return null;

  const getServiceTitle = () => {
    switch(serviceType) {
      case 'moving': return '🚚 Your Moving Estimate';
      case 'labor': return '💪 Your Labor Crew Estimate';
      case 'single': return '📦 Your Single Item Move Estimate';
      default: return '💰 Your Estimate';
    }
  };

  return (
    <div
      className="estimate-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="estimate-modal-content"
        style={{
          background: 'white',
          borderRadius: '20px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '85vh',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '15px',
          padding: '20px 30px 15px 30px',
          flexShrink: 0
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#004085' }}>
            {getServiceTitle()}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '32px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '40px',
              height: '40px',
              lineHeight: '32px'
            }}
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{
          overflowY: 'auto',
          flex: 1,
          padding: '0 30px'
        }}>
        {/* Estimate Details */}
        <div style={{
          background: 'linear-gradient(135deg, #e6f1ff 0%, #f0f7ff 100%)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '2px solid #004085'
        }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#004085', marginBottom: '10px', textAlign: 'center' }}>
            ${estimate.total}
          </div>

          {serviceType === 'moving' && (
            <>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                <strong>Move Details:</strong><br/>
                👥 {estimate.crew} professional movers<br/>
                ⏱️ Estimated {estimate.totalHours} hours total<br/>
                {parseFloat(estimate.packingHours || 0) > 0 && (
                  <>📦 Includes {estimate.packingHours} hours packing<br/></>
                )}
                💰 ${estimate.hourlyRate}/hour (moving)
              </div>
            </>
          )}

          {serviceType === 'labor' && (
            <>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                <strong>Labor Details:</strong><br/>
                👥 {estimate.crew} crew members<br/>
                ⏱️ {estimate.laborHours} hours of labor<br/>
                💰 ${estimate.hourlyRate}/hour
              </div>
            </>
          )}

          {serviceType === 'single' && (
            <>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                <strong>Item Details:</strong><br/>
                📦 {estimate.item}<br/>
                👥 {estimate.crew} movers<br/>
                ⏱️ Estimated {estimate.estimatedHours} hours
              </div>
            </>
          )}

          {/* Cost Breakdown */}
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <strong style={{ fontSize: '16px', marginBottom: '10px', display: 'block' }}>Cost Breakdown:</strong>

            {estimate.baseCost && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Base Service:</span>
                <span>${estimate.baseCost}</span>
              </div>
            )}

            {estimate.serviceCharge && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Service Fee ({serviceType === 'labor' ? '8%' : '14%'}):</span>
                <span>${estimate.serviceCharge}</span>
              </div>
            )}

            {estimate.labor && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Labor ({estimate.laborHours} hrs):</span>
                <span>${estimate.labor}</span>
              </div>
            )}

            {estimate.travel && estimate.travel > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Travel Fee:</span>
                <span>${estimate.travel}</span>
              </div>
            )}

            {estimate.stairFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Stairs Fee:</span>
                <span>${estimate.stairFee}</span>
              </div>
            )}

            {estimate.specialItemFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Special Items:</span>
                <span>${estimate.specialItemFee}</span>
              </div>
            )}

            {estimate.packingCost > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Packing Service:</span>
                <span>${estimate.packingCost}</span>
              </div>
            )}

            {estimate.packingMaterialsCost > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}>
                  <span>Packing Materials:</span>
                  <span>${estimate.packingMaterialsCost}</span>
                </div>
                {estimate.packingMaterialsItems && estimate.packingMaterialsItems.length > 0 && (
                  <div style={{
                    marginLeft: '15px',
                    marginBottom: '12px',
                    paddingLeft: '15px',
                    borderLeft: '3px solid #e2e8f0',
                    background: '#f9fafb'
                  }}>
                    <div style={{ fontSize: '12px', marginBottom: '6px', marginTop: '6px', fontWeight: '600', color: '#666' }}>
                      Itemized Materials List:
                    </div>
                    {estimate.packingMaterialsItems.map((item, index) => (
                      <div key={index} style={{
                        fontSize: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                        color: '#555'
                      }}>
                        <span>{item.name} ({item.qty} × ${item.unitPrice.toFixed(2)})</span>
                        <span>${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{
                      background: '#fff9e6',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#856404',
                      marginTop: '8px',
                      marginBottom: '6px',
                      borderLeft: '3px solid #ffc107'
                    }}>
                      <strong>⚠️ Material Purchase Policy:</strong> Additional materials available if needed. You must purchase all materials initially brought out, even if not fully used.
                    </div>
                  </div>
                )}
              </>
            )}

            {estimate.fvpCost > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#28a745', fontWeight: 'bold' }}>
                <span>🛡️ Full Value Protection:</span>
                <span>${estimate.fvpCost}</span>
              </div>
            )}

            {estimate.sameDayFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#dc3545' }}>
                <span>Same-Day Fee (10%):</span>
                <span>${estimate.sameDayFee}</span>
              </div>
            )}

            <div style={{
              borderTop: '2px solid #e2e8f0',
              marginTop: '12px',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#004085'
            }}>
              <span>Total:</span>
              <span>${estimate.total}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: '#fff5e6',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#666',
          marginBottom: '20px',
          borderLeft: '4px solid #ffc107'
        }}>
          <strong>💡 Important:</strong> This is an estimate based on the information provided.
          Final pricing may vary based on actual conditions. All moves have a 2-hour minimum.
        </div>
        </div> {/* End scrollable content */}

        {/* Action Buttons - Sticky at bottom */}
        <div
          className="estimate-modal-buttons"
          style={{
            display: 'flex',
            gap: '10px',
            padding: '20px 30px',
            borderTop: '2px solid #e2e8f0',
            backgroundColor: 'white',
            flexShrink: 0,
            borderRadius: '0 0 20px 20px',
            position: 'sticky',
            bottom: 0,
            zIndex: 10
          }}
        >
          <button
            onClick={onEmailEstimate}
            style={{
              flex: 1,
              padding: '15px',
              background: 'linear-gradient(135deg, #004085 0%, #0056b3 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 64, 133, 0.3)'
            }}
          >
            📧 Email Me This Estimate
          </button>
          <button
            onClick={onBookNow}
            style={{
              flex: 1,
              padding: '15px',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
            }}
          >
            ✓ Book This Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimateModal;
