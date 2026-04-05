import React, { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import StatsCards from '../components/StatsCards';
import SearchFilterBar from '../components/SearchFilterBar';
import CustomerForm from '../components/CustomerForm';
import LeadTable from '../components/LeadTable';
import api from '../api/api';

function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('created_desc');

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/leads');
      setLeads(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const processedLeads = useMemo(() => {
    let result = [...leads];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((lead) =>
        lead.name?.toLowerCase().includes(query) ||
        lead.job?.toLowerCase().includes(query) ||
        lead.contact?.toLowerCase().includes(query)
      );
    }

    // Filter by Priority
    if (filterPriority !== 'All') {
      result = result.filter(
        (lead) => lead.priority_band?.toLowerCase() === filterPriority.toLowerCase()
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'score_desc':
          return (b.propensity_score || 0) - (a.propensity_score || 0);
        case 'score_asc':
          return (a.propensity_score || 0) - (b.propensity_score || 0);
        case 'created_asc':
          return new Date(a.prediction_created_at || 0) - new Date(b.prediction_created_at || 0);
        case 'created_desc':
        default:
          return new Date(b.prediction_created_at || 0) - new Date(a.prediction_created_at || 0);
      }
    });

    return result;
  }, [leads, searchQuery, filterPriority, sortBy]);

  return (
    <div className="container">
      <DashboardHeader />
      
      {error && (
        <div className="card anim-fade-in" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #F87171', marginBottom: '1.5rem', padding: '1rem' }}>
          <strong>Error Connecting to Engine:</strong> {error}
        </div>
      )}

      {loading && leads.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79,70,229,0.2)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
          Loading intelligence data...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div className="anim-fade-in dashboard-layout">
          <StatsCards leads={leads} />
          
          <CustomerForm onSuccess={fetchLeads} />
            
          <SearchFilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onRefresh={fetchLeads}
          />

          <LeadTable leads={processedLeads} />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
