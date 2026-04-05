import React from 'react';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);

function SearchFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  filterPriority, 
  setFilterPriority, 
  sortBy, 
  setSortBy,
  onRefresh 
}) {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '1rem', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      marginBottom: '1.5rem',
      backgroundColor: 'var(--bg-card)',
      padding: '1rem 1.25rem',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '400px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <SearchIcon />
          </div>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search leads by name, job..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
          />
        </div>
        
        <select 
          className="form-control"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ width: 'auto', borderRadius: 'var(--radius-full)', fontWeight: 500, color: 'var(--text-secondary)' }}
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <select 
          className="form-control"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ width: 'auto', borderRadius: 'var(--radius-full)', fontWeight: 500, color: 'var(--text-secondary)' }}
        >
          <option value="created_desc">Newest First</option>
          <option value="created_asc">Oldest First</option>
          <option value="score_desc">Propensity (High-Low)</option>
          <option value="score_asc">Propensity (Low-High)</option>
        </select>
      </div>

      <button className="btn btn-outline" onClick={onRefresh} style={{ borderRadius: 'var(--radius-full)' }}>
        <RefreshIcon /> Refresh
      </button>
    </div>
  );
}

export default SearchFilterBar;
