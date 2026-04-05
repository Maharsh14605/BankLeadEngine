import React from 'react';
import StatusBadge from './StatusBadge';

function LeadTable({ leads, onRowClick }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📊</div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>No Leads Found</h3>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Try adjusting your search criteria or score a new lead.</p>
      </div>
    );
  }

  const formatPercentage = (score) => {
    if (score === undefined || score === null) return '-';
    return `${(score * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Format to look cleaner, like "Apr 2, 14:30"
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Demographics</th>
              <th>Contact Strategy</th>
              <th>Propensity</th>
              <th>Conversion</th>
              <th>Priority</th>
              <th>Scored On</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr 
                key={lead.lead_id}
                onClick={() => onRowClick && onRowClick(lead.lead_id)}
                style={{ cursor: onRowClick ? 'pointer' : 'default', transition: 'transform 0.1s ease, box-shadow 0.1s ease, background-color 0.2s ease' }}
                onMouseOver={(e) => { if (onRowClick) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseOut={(e) => { if (onRowClick) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name || 'Anonymous'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{lead.lead_id}</div>
                </td>
                <td>
                  <div style={{ textTransform: 'capitalize', fontWeight: 500 }}>{lead.job}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lead.age} yrs • {lead.marital}</div>
                </td>
                <td>
                  <div style={{ textTransform: 'capitalize', fontWeight: 500 }}>{lead.contact}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Campaign: {lead.campaign}</div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                  {formatPercentage(lead.propensity_score)}
                </td>
                <td>
                  <StatusBadge type="prediction" label={lead.predicted_label} />
                </td>
                <td>
                  <StatusBadge type="priority" label={lead.priority_band} />
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {formatDate(lead.prediction_created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeadTable;
