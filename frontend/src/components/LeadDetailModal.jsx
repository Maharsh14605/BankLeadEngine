import React, { useState, useEffect } from 'react';
import api from '../api/api';
import StatusBadge from './StatusBadge';
import ExplanationPanel from './ExplanationPanel';

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

function LeadDetailModal({ leadId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [explanation, setExplanation] = useState(null);
  
  const [offerGenerating, setOfferGenerating] = useState(false);
  const [offerError, setOfferError] = useState(null);
  
  const API_BASE = api.defaults.baseURL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!leadId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [detailRes, expRes] = await Promise.all([
          api.get(`/leads/${leadId}/detail`),
          api.get(`/leads/${leadId}/explanation`)
        ]);
        setData(detailRes.data);
        setExplanation(expRes.data);
      } catch (err) {
        console.error("Failed to load details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [leadId]);

  const handleGenerateOffer = async () => {
    setOfferGenerating(true);
    setOfferError(null);
    try {
      const res = await api.post(`/offers/generate/${leadId}`);
      // Update local state to reflect the new offer
      setData((prev) => ({ ...prev, offer: res.data }));
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setOfferError(err.response.data.detail);
      } else {
        setOfferError("Failed to generate offer letter.");
      }
    } finally {
      setOfferGenerating(false);
    }
  };

  if (!leadId) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div className="card anim-fade-in" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <XIcon />
        </button>

        {loading ? (
           <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Analytics...</div>
        ) : !data ? (
           <div style={{ padding: '4rem 0', textAlign: 'center', color: '#DC2626' }}>Error loading data.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Header */}
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {data.lead.name || `Lead #${data.lead.id}`}
                {data.latest_prediction && <StatusBadge type="priority" label={data.latest_prediction.priority_band} />}
              </h2>
              <div style={{ color: 'var(--text-secondary)' }}>
                {data.lead.job} • {data.lead.age} yrs • {data.lead.education}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Profile Data */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Contact Type</strong><div style={{textTransform:'capitalize'}}>{data.lead.contact}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Marital</strong><div style={{textTransform:'capitalize'}}>{data.lead.marital}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Loan/Housing</strong><div style={{textTransform:'capitalize'}}>{data.lead.loan === 'yes' ? 'Yes' : 'No'} / {data.lead.housing === 'yes' ? 'Yes' : 'No'}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Prior Outcome</strong><div style={{textTransform:'capitalize'}}>{data.lead.poutcome}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Campaign</strong><div>{data.lead.campaign}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Prev. Contacts</strong><div>{data.lead.previous} ({data.lead.pdays === 999 ? 'none' : data.lead.pdays + 'd'})</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Euribor 3m</strong><div>{data.lead.euribor3m}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Emp. Var. Rate</strong><div>{data.lead.emp_var_rate}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Cons. Prices</strong><div>{data.lead.cons_price_idx}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Cons. Conf.</strong><div>{data.lead.cons_conf_idx}</div></div>
                  <div><strong style={{color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase'}}>Employed</strong><div>{data.lead.nr_employed}</div></div>
                </div>

                {/* Explanation */}
                <ExplanationPanel explanation={explanation} />
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Prediction Summary */}
                {data.latest_prediction ? (
                  <div style={{ 
                    padding: '1.5rem', 
                    borderRadius: 'var(--radius-lg)', 
                    background: data.latest_prediction.priority_band?.toLowerCase() === 'high' ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(79, 70, 229, 0.1))' : 'var(--bg-input)',
                    border: '1px solid rgba(79, 70, 229, 0.2)'
                  }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem' }}>Model Prediction</h4>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif', color: 'var(--accent-primary)', marginBottom: '0.5rem', lineHeight: 1 }}>
                      {((data.latest_prediction.propensity_score || 0) * 100).toFixed(1)}%
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status:</span>
                      <StatusBadge type="prediction" label={data.latest_prediction.predicted_label} />
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                    No prediction recorded for this lead.
                  </div>
                )}

                {/* Offer Actions */}
                <div style={{ 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem' }}>Offer Workflow</h4>
                  
                  {data.offer ? (
                    <div>
                      <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, backgroundColor: '#10B981', borderRadius: '50%' }}></div>
                        Offer Letter Generated
                      </div>
                      <a 
                        href={`${API_BASE}/offers/download/${data.offer.id}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-outline" 
                        style={{ width: '100%', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <DownloadIcon /> Download PDF File
                      </a>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                         {new Date(data.offer.created_at).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Premium offer generation is available for qualifying leads.
                      </p>
                      {offerError && <div style={{ color: '#DC2626', fontSize: '0.8rem', marginBottom: '1rem', backgroundColor: '#FEF2F2', padding: '0.5rem', borderRadius: '4px' }}>{offerError}</div>}
                      
                      <button 
                        onClick={handleGenerateOffer} 
                        disabled={offerGenerating}
                        className="btn btn-primary" 
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <FileIcon /> {offerGenerating ? 'Generating...' : 'Generate Offer Letter'}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default LeadDetailModal;
