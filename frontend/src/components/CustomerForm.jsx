import React, { useState } from 'react';
import api from '../api/api';

const INITIAL_STATE = {
  name: '',
  age: '',
  job: 'management',
  marital: 'married',
  education: 'university.degree',
  default: 'no',
  housing: 'yes',
  loan: 'no',
  contact: 'cellular',
  month: 'may',
  day_of_week: 'mon',
  campaign: 1,
  pdays: 999,
  previous: 0,
  poutcome: 'nonexistent',
  emp_var_rate: 1.1,
  cons_price_idx: 93.994,
  cons_conf_idx: -36.4,
  euribor3m: 4.857,
  nr_employed: 5191.0
};

// Form Icons
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
const PhoneCallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const TrendingUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const SparklesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
);

function CustomerForm({ onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessResult(null);

    const payload = {
      ...formData,
      age: Number(formData.age),
      campaign: Number(formData.campaign),
      pdays: Number(formData.pdays),
      previous: Number(formData.previous),
      emp_var_rate: Number(formData.emp_var_rate),
      cons_price_idx: Number(formData.cons_price_idx),
      cons_conf_idx: Number(formData.cons_conf_idx),
      euribor3m: Number(formData.euribor3m),
      nr_employed: Number(formData.nr_employed),
    };

    try {
      const response = await api.post('/scoring/score-lead', payload);
      setSuccessResult(response.data);
      setFormData(INITIAL_STATE);
      if (onSuccess) onSuccess();
      
      // Auto-hide success after 8 seconds
      setTimeout(() => setSuccessResult(null), 8000);
    } catch (err) {
      console.error(err);
      setError('Failed to score lead. Please check the inputs or server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
          <SparklesIcon /> AI Lead Scoring Engine
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Predictive conversion analysis workspace</span>
      </div>
      
      {error && (
        <div className="anim-fade-in" style={{ padding: '1rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #FCA5A5' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {successResult && (
        <div className="anim-fade-in" style={{ 
          padding: '1.5rem', 
          background: 'linear-gradient(to right, #F0FDF4, #DCFCE7)', 
          color: '#065F46', 
          borderRadius: 'var(--radius-lg)', 
          marginBottom: '2rem', 
          border: '1px solid #6EE7B7',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)'
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <SparklesIcon /> Lead Successfully Scored
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#047857', fontWeight: 600 }}>Propensity</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#064E3B' }}>{(successResult.propensity_score * 100).toFixed(1)}%</div>
            </div>
            <div style={{ background: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#047857', fontWeight: 600 }}>Priority Band</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#064E3B', marginTop: '0.25rem' }}>{successResult.priority_band}</div>
            </div>
            <div style={{ background: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#047857', fontWeight: 600 }}>Predicted Label</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#064E3B', marginTop: '0.25rem' }}>{successResult.predicted_label === 1 ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Full-width 4-column layout for the major sections */}
        <div className="form-master-grid">
          
          {/* SECTION 1: Personal */}
          <div className="form-section">
            <div className="form-section-header"><UserIcon /> Personal</div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-control" type="number" name="age" required placeholder="35" value={formData.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select className="form-control" name="marital" value={formData.marital} onChange={handleChange}>
                <option value="single">Single</option><option value="married">Married</option><option value="divorced">Divorced</option><option value="unknown">Unknown</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Education Level</label>
              <select className="form-control" name="education" value={formData.education} onChange={handleChange}>
                <option value="basic.4y">Basic 4Y</option><option value="basic.6y">Basic 6Y</option><option value="basic.9y">Basic 9Y</option>
                <option value="high.school">High School</option><option value="professional.course">Professional Course</option>
                <option value="university.degree">University Degree</option><option value="illiterate">Illiterate</option><option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* SECTION 2: Financial */}
          <div className="form-section">
            <div className="form-section-header"><BriefcaseIcon /> Financials</div>
            <div className="form-group">
              <label className="form-label">Job Sector</label>
              <select className="form-control" name="job" value={formData.job} onChange={handleChange}>
                <option value="admin.">Admin</option><option value="blue-collar">Blue Collar</option><option value="entrepreneur">Entrepreneur</option>
                <option value="housemaid">Housemaid</option><option value="management">Management</option><option value="retired">Retired</option>
                <option value="self-employed">Self-employed</option><option value="services">Services</option><option value="student">Student</option>
                <option value="technician">Technician</option><option value="unemployed">Unemployed</option><option value="unknown">Unknown</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Credit Default?</label>
              <select className="form-control" name="default" value={formData.default} onChange={handleChange}>
                <option value="no">No</option><option value="yes">Yes</option><option value="unknown">Unknown</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Housing Loan</label>
              <select className="form-control" name="housing" value={formData.housing} onChange={handleChange}>
                <option value="no">No</option><option value="yes">Yes</option><option value="unknown">Unknown</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Personal Loan</label>
              <select className="form-control" name="loan" value={formData.loan} onChange={handleChange}>
                <option value="no">No</option><option value="yes">Yes</option><option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* SECTION 3: Campaign */}
          <div className="form-section">
            <div className="form-section-header"><PhoneCallIcon /> Contact Strategy</div>
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label" style={{display:'block', marginBottom: '0.4rem'}}>Type</label>
                <select className="form-control" name="contact" value={formData.contact} onChange={handleChange}>
                  <option value="cellular">Cellular</option><option value="telephone">Phone</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{display:'block', marginBottom: '0.4rem'}}>Month</label>
                <select className="form-control" name="month" value={formData.month} onChange={handleChange}>
                  {['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Day of Week</label>
              <select
                className="form-control"
                name="day_of_week"
                value={formData.day_of_week}
                onChange={handleChange}
              >
                <option value="mon">Monday</option>
                <option value="tue">Tuesday</option>
                <option value="wed">Wednesday</option>
                <option value="thu">Thursday</option>
                <option value="fri">Friday</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label" style={{display:'block', marginBottom: '0.4rem'}}>Campaigns</label>
                <input className="form-control" type="number" name="campaign" required value={formData.campaign} onChange={handleChange} />
              </div>
              <div>
                <label className="form-label" style={{display:'block', marginBottom: '0.4rem'}}>Prev. Count</label>
                <input className="form-control" type="number" name="previous" required value={formData.previous} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Pdays (Days since last contact)</label>
              <input className="form-control" type="number" name="pdays" required value={formData.pdays} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Previous Outcome</label>
              <select className="form-control" name="poutcome" value={formData.poutcome} onChange={handleChange}>
                <option value="nonexistent">Nonexistent</option><option value="failure">Failure</option><option value="success">Success</option>
              </select>
            </div>
          </div>

          {/* SECTION 4: Economic Indicators */}
          <div className="form-section">
            <div className="form-section-header"><TrendingUpIcon /> Economics</div>
            <div className="form-group">
              <label className="form-label">Emp Var Rate</label>
              <input className="form-control" type="number" step="any" name="emp_var_rate" required value={formData.emp_var_rate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Cons Price Idx</label>
              <input className="form-control" type="number" step="any" name="cons_price_idx" required value={formData.cons_price_idx} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Cons Conf Idx</label>
              <input className="form-control" type="number" step="any" name="cons_conf_idx" required value={formData.cons_conf_idx} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label" style={{display:'block', marginBottom: '0.4rem'}}>Euribor 3m</label>
                <input className="form-control" type="number" step="any" name="euribor3m" required value={formData.euribor3m} onChange={handleChange} />
              </div>
              <div>
                <label className="form-label" style={{display:'block', marginBottom: '0.4rem'}}>Employed</label>
                <input className="form-control" type="number" step="any" name="nr_employed" required value={formData.nr_employed} onChange={handleChange} />
              </div>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontSize: '1.1rem', padding: '1rem 3rem', width: 'auto' }}>
            <SparklesIcon /> {loading ? 'Analyzing...' : 'Run Lead Scoring Engine'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;