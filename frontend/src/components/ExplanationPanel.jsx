import React from 'react';

const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

const TrendDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
);

function ExplanationPanel({ explanation }) {
  if (!explanation) return null;

  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      backgroundColor: '#FAFAFA'
    }}>
      <h4 style={{ 
        margin: '0 0 0.75rem 0', 
        fontSize: '0.9rem', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em', 
        color: 'var(--text-secondary)' 
      }}>
        Machine Learning Insights
      </h4>
      
      <p style={{ 
        margin: '0 0 1.25rem 0', 
        fontSize: '0.95rem',
        lineHeight: 1.5,
        color: 'var(--text-primary)',
        fontWeight: 500
      }}>
        {explanation.summary}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Positive Factors */}
        <div>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            color: '#065F46', 
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <TrendUpIcon /> Top Positive Factors
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {explanation.positive_features?.map((feat, idx) => (
              <div key={idx} style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}>
                <span style={{ fontWeight: 500, color: '#064E3B' }}>{feat.feature_name}</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>+{feat.contribution.toFixed(3)}</span>
              </div>
            ))}
            {(!explanation.positive_features || explanation.positive_features.length === 0) && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No significant positive drivers found.
              </div>
            )}
          </div>
        </div>

        {/* Negative Factors */}
        <div>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            color: '#991B1B', 
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <TrendDownIcon /> Top Negative Factors
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {explanation.negative_features?.map((feat, idx) => (
              <div key={idx} style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}>
                <span style={{ fontWeight: 500, color: '#7F1D1D' }}>{feat.feature_name}</span>
                <span style={{ fontWeight: 700, color: '#DC2626' }}>{feat.contribution.toFixed(3)}</span>
              </div>
            ))}
            {(!explanation.negative_features || explanation.negative_features.length === 0) && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No significant negative drivers found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ExplanationPanel;
