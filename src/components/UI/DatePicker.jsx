// FILE: src/components/UI/DatePicker.jsx
// PURPOSE: Date selection component

import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import FlowController from '../FlowController';

const DatePicker = ({ onDateSelected }) => {
  const { chatState } = useChatContext();
  const [selectedDate, setSelectedDate] = useState('');
  const flowController = FlowController();

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  // Default: allow dates from today up to 1 year in the future
  let minDate = `${yyyy}-${mm}-${dd}`;
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const maxDD = String(oneYearFromNow.getDate()).padStart(2, '0');
  const maxMM = String(oneYearFromNow.getMonth() + 1).padStart(2, '0');
  const maxYYYY = oneYearFromNow.getFullYear();
  let maxDate = `${maxYYYY}-${maxMM}-${maxDD}`;

  // For insurance claims, allow past dates
  if (chatState.stage === 'move_details_verification') {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const minDD = String(oneYearAgo.getDate()).padStart(2, '0');
    const minMM = String(oneYearAgo.getMonth() + 1).padStart(2, '0');
    const minYYYY = oneYearAgo.getFullYear();
    minDate = `${minYYYY}-${minMM}-${minDD}`;
    maxDate = `${yyyy}-${mm}-${dd}`;
  }

  const handleConfirm = () => {
    if (selectedDate) {
      const date = new Date(selectedDate + 'T00:00:00');
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      onDateSelected(formattedDate);
    }
  };

  const handleCancel = () => {
    // Could add cancel logic here
  };

  return (
    <div id="wfm-date-picker-container" className="date-picker-container">
      <div className="date-picker-header">Select Your Moving Date</div>
      <input
        type="date"
        id="wfm-date-picker"
        className="chat-date-input"
        min={minDate}
        max={maxDate}
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <div className="date-picker-buttons">
        <button className="date-confirm-btn" onClick={handleConfirm}>
          Confirm Date
        </button>
        <button className="date-cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DatePicker;