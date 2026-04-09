import React from 'react';

function StatusBadge({ type, label }) {
  let badgeStyle = {};

  if (type === 'priority') {
    switch (label?.toLowerCase()) {
      case 'high':
        badgeStyle = { 
          backgroundColor: 'var(--color-high-bg)', 
          color: 'var(--color-high-text)',
          border: '1px solid var(--color-high-border)'
        };
        break;
      case 'medium':
        badgeStyle = { 
          backgroundColor: 'var(--color-medium-bg)', 
          color: 'var(--color-medium-text)',
          border: '1px solid var(--color-medium-border)'
        };
        break;
      case 'low':
        badgeStyle = { 
          backgroundColor: 'var(--color-low-bg)', 
          color: 'var(--color-low-text)',
          border: '1px solid var(--color-low-border)'
        };
        break;
      default:
        badgeStyle = { 
          backgroundColor: 'var(--bg-input)', 
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        };
    }
  } else if (type === 'prediction') {
    if (label === 'Yes' || label === 1 || label === '1') {
      badgeStyle = { 
        backgroundColor: 'rgba(79, 70, 229, 0.1)', 
        color: 'var(--accent-primary)',
        border: '1px solid rgba(79, 70, 229, 0.3)'
      };
      label = 'Yes';
    } else {
      badgeStyle = { 
        backgroundColor: 'var(--bg-input)', 
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-color)'
      };
      label = 'No';
    }
  }

  return (
    <span className="badge" style={badgeStyle}>
      {label}
    </span>
  );
}

export default StatusBadge;
