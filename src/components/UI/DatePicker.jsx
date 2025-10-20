// FILE: src/components/UI/DatePicker.jsx
// PURPOSE: Simple dropdown date picker that works everywhere

import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';

const DatePicker = ({ onDateSelected }) => {
  const { chatState } = useChatContext();
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options (today to 1 year from now, or 1 year ago to today for insurance)
  const getYearOptions = () => {
    const years = [];
    if (chatState.stage === 'move_details_verification') {
      // Past year for insurance claims
      for (let i = today.getFullYear() - 1; i <= today.getFullYear(); i++) {
        years.push(i);
      }
    } else {
      // Future year for moving dates
      for (let i = today.getFullYear(); i <= today.getFullYear() + 1; i++) {
        years.push(i);
      }
    }
    return years;
  };

  // Get days in selected month
  const getDaysInMonth = () => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  };

  // Generate day options
  const getDayOptions = () => {
    const days = [];
    const maxDays = getDaysInMonth();
    for (let i = 1; i <= maxDays; i++) {
      days.push(i);
    }
    return days;
  };

  const handleConfirm = () => {
    if (selectedMonth && selectedDay && selectedYear) {
      const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      onDateSelected(formattedDate);
    }
  };

  return (
    <div id="wfm-date-picker-container" className="date-picker-container">
      <div className="date-picker-header">Select Your Moving Date</div>

      <div className="dropdown-date-picker">
        <div className="date-dropdown-group">
          <label className="date-dropdown-label">Month</label>
          <select
            className="date-dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((month, idx) => (
              <option key={idx} value={idx + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="date-dropdown-group">
          <label className="date-dropdown-label">Day</label>
          <select
            className="date-dropdown"
            value={selectedDay}
            onChange={(e) => setSelectedDay(parseInt(e.target.value))}
          >
            {getDayOptions().map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="date-dropdown-group">
          <label className="date-dropdown-label">Year</label>
          <select
            className="date-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {getYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="selected-date-display">
        {selectedMonth && selectedDay && selectedYear && (
          <>
            Selected: {monthNames[selectedMonth - 1]} {selectedDay}, {selectedYear}
          </>
        )}
      </div>

      <div className="date-picker-buttons">
        <button className="date-confirm-btn" onClick={handleConfirm}>
          Confirm Date
        </button>
      </div>
    </div>
  );
};

export default DatePicker;