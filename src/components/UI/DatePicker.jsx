// FILE: src/components/UI/DatePicker.jsx
// PURPOSE: Custom calendar date picker component for mobile

import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';

const DatePicker = ({ onDateSelected }) => {
  const { chatState } = useChatContext();
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  // Determine min/max dates based on stage
  let minDate = new Date(today);
  let maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  if (chatState.stage === 'move_details_verification') {
    minDate = new Date(today);
    minDate.setFullYear(minDate.getFullYear() - 1);
    maxDate = new Date(today);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < minDate || date > maxDate;
  };

  const isToday = (day) => {
    return day === today.getDate() &&
           currentMonth === today.getMonth() &&
           currentYear === today.getFullYear();
  };

  const isSelected = (day) => {
    return selectedDate &&
           day === selectedDate.getDate() &&
           currentMonth === selectedDate.getMonth() &&
           currentYear === selectedDate.getFullYear();
  };

  const handleDayClick = (day) => {
    if (!isDateDisabled(day)) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = selectedDate.toLocaleDateString('en-US', options);
      onDateSelected(formattedDate);
    }
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const disabled = isDateDisabled(day);
      const isCurrentDay = isToday(day);
      const isSelectedDay = isSelected(day);

      days.push(
        <button
          key={day}
          className={`calendar-day ${disabled ? 'disabled' : ''} ${isCurrentDay ? 'today' : ''} ${isSelectedDay ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
          disabled={disabled}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div id="wfm-date-picker-container" className="date-picker-container">
      <div className="date-picker-header">Select Your Moving Date</div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={handlePrevMonth}>
            ←
          </button>
          <div className="calendar-month-year">
            {monthNames[currentMonth]} {currentYear}
          </div>
          <button className="calendar-nav-btn" onClick={handleNextMonth}>
            →
          </button>
        </div>

        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-grid">
          {renderCalendar()}
        </div>

        {selectedDate && (
          <div className="selected-date-display">
            Selected: {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      </div>

      <div className="date-picker-buttons">
        <button
          className="date-confirm-btn"
          onClick={handleConfirm}
          disabled={!selectedDate}
        >
          Confirm Date
        </button>
      </div>
    </div>
  );
};

export default DatePicker;