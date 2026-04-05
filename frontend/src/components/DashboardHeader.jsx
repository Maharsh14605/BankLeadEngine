import React from 'react';

function DashboardHeader() {
  return (
    <div style={{ 
      marginBottom: '2.5rem', 
      position: 'relative',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', margin: 0, letterSpacing: '-0.02em' }}>
          Banking Intelligence <span className="text-gradient">Dashboard</span>
        </h1>
        <span className="badge" style={{ 
          backgroundColor: 'rgba(79, 70, 229, 0.1)', 
          color: 'var(--accent-primary)',
          border: '1px solid rgba(79, 70, 229, 0.2)',
          fontSize: '0.7rem'
        }}>
          AI Scoring Engine v2.0
        </span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0, maxWidth: '600px' }}>
        Analyze lead propensity scores, optimize conversion strategies, and harness machine learning insights.
      </p>
    </div>
  );
}

export default DashboardHeader;
