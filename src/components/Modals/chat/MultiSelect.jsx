// FILE: src/components/Modals/chat/MultiSelect.jsx
// PURPOSE: Multi-select component for selecting multiple items (shop equipment, special items, etc.)

import React, { useState } from 'react';

const MultiSelect = ({ options, onSubmit, minSelections = 0, title = "Select all that apply:" }) => {
  const [selected, setSelected] = useState([]);

  const handleToggle = (value, option) => {
    // Prevent selecting disabled items (items with ❌ or explicitly disabled)
    const isDisabled = option.text.includes('❌') || option.disabled;
    if (isDisabled) return;

    setSelected(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSubmit = () => {
    if (selected.length >= minSelections) {
      onSubmit(selected);
    }
  };

  const handleNone = () => {
    onSubmit([]);
  };

  return (
    <div style={{
      padding: '12px 10px 16px 10px',
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      flexShrink: 0
    }}>
      {/* Title */}
      <div style={{
        fontSize: '13px',
        color: '#666',
        marginBottom: '12px',
        textAlign: 'center',
        fontWeight: '500'
      }}>
        {title}
      </div>

      {/* Options */}
      <div style={{
        maxHeight: '240px',
        overflowY: 'auto',
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {options.map((option) => {
          const isDisabled = option.text.includes('❌') || option.disabled;
          return (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                background: isDisabled
                  ? '#f5f5f5'
                  : selected.includes(option.value)
                  ? '#f0f4f8'
                  : 'white',
                border: `2px solid ${
                  isDisabled
                    ? '#d0d0d0'
                    : selected.includes(option.value)
                    ? '#333'
                    : '#e2e8f0'
                }`,
                borderRadius: '12px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                userSelect: 'none',
                opacity: isDisabled ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isDisabled && !selected.includes(option.value)) {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.background = '#fafafa';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled && !selected.includes(option.value)) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => handleToggle(option.value, option)}
                disabled={isDisabled}
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '12px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  accentColor: '#333'
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDisabled ? '#999' : '#333',
                  flex: 1,
                  textDecoration: isDisabled ? 'line-through' : 'none'
                }}
              >
                {option.text}
              </span>
            </label>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={handleNone}
          style={{
            flex: 1,
            padding: '12px',
            background: 'white',
            border: '2px solid #333',
            borderRadius: '25px',
            color: '#333',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f0f4f8';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
          }}
        >
          None
        </button>
        <button
          onClick={handleSubmit}
          disabled={selected.length < minSelections}
          style={{
            flex: 2,
            padding: '12px',
            background: selected.length >= minSelections
              ? 'linear-gradient(135deg, #2c2c2c 0%, #404040 100%)'
              : '#e0e0e0',
            border: 'none',
            borderRadius: '25px',
            color: selected.length >= minSelections ? 'white' : '#999',
            fontWeight: '600',
            fontSize: '14px',
            cursor: selected.length >= minSelections ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            boxShadow: selected.length >= minSelections ? '0 4px 15px rgba(0,0,0,0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (selected.length >= minSelections) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (selected.length >= minSelections) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            }
          }}
        >
          Continue {selected.length > 0 && `(${selected.length} selected)`}
        </button>
      </div>
    </div>
  );
};

export default MultiSelect;
