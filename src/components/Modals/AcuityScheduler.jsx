// FILE: src/components/Modals/AcuityScheduler.jsx
// PURPOSE: Acuity scheduling iframe modal

import React, { useState, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { CONFIG } from '../../constants/config';

const AcuityScheduler = () => {
  const { chatState } = useChatContext();
  const [showScheduler, setShowScheduler] = useState(false);
  const [acuityUrl, setAcuityUrl] = useState('');

  useEffect(() => {
    // Check if we should show the scheduler
    if (chatState.stage === 'showing_acuity') {
      buildAcuityUrl();
      setShowScheduler(true);
    } else {
      setShowScheduler(false);
    }
  }, [chatState.stage]);

  // Listen for manual open event from Check Availability button
  useEffect(() => {
    const handleOpenScheduler = () => {
      buildAcuityUrl();
      setShowScheduler(true);
    };

    window.addEventListener('open-acuity-scheduler', handleOpenScheduler);

    return () => {
      window.removeEventListener('open-acuity-scheduler', handleOpenScheduler);
    };
  }, [chatState.data]);

  const buildAcuityUrl = () => {
    let url = CONFIG.acuityUrl;
    const params = new URLSearchParams();

    // Add customer information
    if (chatState.data.firstName) params.append('first_name', chatState.data.firstName);
    if (chatState.data.lastName) params.append('last_name', chatState.data.lastName);
    if (chatState.data.email) params.append('email', chatState.data.email);
    if (chatState.data.phone) params.append('phone', chatState.data.phone);

    // Add move details
    if (chatState.data.from) params.append('field:10550095', chatState.data.from);
    if (chatState.data.to) params.append('field:10550096', chatState.data.to);
    if (chatState.data.movingDate) params.append('field:10550097', chatState.data.movingDate);

    const serviceTypeText = chatState.serviceType === 'moving' ? 'Full Moving Service' :
      chatState.serviceType === 'labor' ? 'Labor Only' : 'Single Item Move';
    params.append('field:10550098', serviceTypeText);

    if (chatState.data.estimate) {
      params.append('field:10550099', `$${chatState.data.estimate.total}`);
    }

    if (params.toString()) {
      url += (url.includes('?') ? '&' : '?') + params.toString();
    }

    setAcuityUrl(url);
  };

  const handleClose = () => {
    setShowScheduler(false);
  };

  if (!showScheduler) {
    return null;
  }

  return (
    <div id="wfm-acuity-container" className="acuity-container">
      <div id="wfm-acuity-header" className="acuity-header">
        <button id="wfm-acuity-back" className="acuity-back-btn" onClick={handleClose}>
          ← Back to Chat
        </button>
        <span>Schedule Your Move with Sarah</span>
      </div>
      <iframe
        id="wfm-acuity-iframe"
        className="acuity-iframe"
        src={acuityUrl}
        title="Schedule Your Move"
      />
    </div>
  );
};

export default AcuityScheduler;