// FILE: src/components/Modals/PestDisclaimer.jsx
// PURPOSE: Pest control disclaimer modal

import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import { PEST_DISCLAIMER_TEXT } from '../../constants/messages';

const PestDisclaimer = ({ onAgree }) => {
  const { chatState, updateChatData } = useChatContext();

  const handleAgree = () => {
    updateChatData({
      pestDisclaimerAgreed: true,
      pestDisclaimerTimestamp: new Date().toISOString()
    });
    if (onAgree) onAgree();
  };

  return (
    <div className="pest-disclaimer">
      <div className="pest-disclaimer-header">⚠️ IMPORTANT PEST CONTROL DISCLAIMER</div>
      <p>{PEST_DISCLAIMER_TEXT}</p>
      <div
        className={`pest-disclaimer-checkbox ${chatState.data.pestDisclaimerAgreed ? 'checked' : ''}`}
        onClick={chatState.data.pestDisclaimerAgreed ? null : handleAgree}
      >
        {chatState.data.pestDisclaimerAgreed
          ? '✅ I agree to the terms above'
          : '☐ Click here to agree'}
      </div>
    </div>
  );
};

export default PestDisclaimer;