import React from 'react';

// Simple decorative SVG Icons
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const BarChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>
  </svg>
);

function StatsCards({ leads }) {
  const totalLeads = leads.length;
  
  const highPriority = leads.filter(lead => lead.priority_band?.toLowerCase() === 'high').length;
  const mediumPriority = leads.filter(lead => lead.priority_band?.toLowerCase() === 'medium').length;
  
  const avgPropensity = totalLeads 
    ? leads.reduce((sum, lead) => sum + (lead.propensity_score || 0), 0) / totalLeads 
    : 0;

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const valueStyle = {
    fontSize: '2.5rem',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: '1',
  };

  const iconWrapStyle = (colorBg, colorText) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: colorBg,
    color: colorText,
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      <div className="card" style={{ ...cardStyle, borderTop: '4px solid var(--accent-primary)' }}>
        <div style={labelStyle}>
          Total Leads
          <div style={iconWrapStyle('rgba(79, 70, 229, 0.1)', 'var(--accent-primary)')}>
            <UsersIcon />
          </div>
        </div>
        <div style={valueStyle}>{totalLeads}</div>
      </div>
      
      <div className="card" style={{ ...cardStyle, borderTop: '4px solid var(--color-high-border)' }}>
        <div style={labelStyle}>
          High Priority
          <div style={iconWrapStyle('var(--color-high-bg)', 'var(--color-high-text)')}>
            <AlertIcon />
          </div>
        </div>
        <div style={{ ...valueStyle, color: 'var(--color-high-text)' }}>{highPriority}</div>
      </div>
      
      <div className="card" style={{ ...cardStyle, borderTop: '4px solid var(--color-medium-border)' }}>
        <div style={labelStyle}>
          Medium Priority
          <div style={iconWrapStyle('var(--color-medium-bg)', 'var(--color-medium-text)')}>
            <BarChartIcon />
          </div>
        </div>
        <div style={{ ...valueStyle, color: 'var(--color-medium-text)' }}>{mediumPriority}</div>
      </div>
      
      <div className="card" style={{ ...cardStyle, borderTop: '4px solid #38BDF8' }}>
        <div style={labelStyle}>
          Avg Propensity
          <div style={iconWrapStyle('rgba(56, 189, 248, 0.1)', '#0284C7')}>
            <TargetIcon />
          </div>
        </div>
        <div style={{ ...valueStyle, color: '#0369A1' }}>{(avgPropensity * 100).toFixed(1)}%</div>
      </div>
    </div>
  );
}

export default StatsCards;
