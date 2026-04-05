export default function DashboardTable({ rows, loading }) {
    if (loading) {
      return <p>Loading dashboard data...</p>;
    }
  
    if (!rows.length) {
      return <p>No leads found yet.</p>;
    }
  
    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Job</th>
              <th>Marital</th>
              <th>Contact</th>
              <th>Score</th>
              <th>Predicted</th>
              <th>Priority</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr key={lead.lead_id}>
                <td>{lead.name || "N/A"}</td>
                <td>{lead.age}</td>
                <td>{lead.job}</td>
                <td>{lead.marital}</td>
                <td>{lead.contact}</td>
                <td>{lead.propensity_score.toFixed(4)}</td>
                <td>{lead.predicted_label}</td>
                <td>{lead.priority_band}</td>
                <td>{new Date(lead.prediction_created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }