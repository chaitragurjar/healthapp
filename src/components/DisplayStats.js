import React, { useEffect, useState } from 'react';
import { displayStats } from '../functionality/displayBalance';

import './DisplayStats.css'; // Add a CSS file for styling

const ClaimStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await displayStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Claim Stats</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Approved Amount</h3>
          <p>&#8377;{stats.totalApprovedAmount}</p>
        </div>
        <div className="card">
          <h3>Total Rejected Amount</h3>
          <p>&#8377;{stats.totalRejectedAmount}</p>
        </div>
        <div className="card">
          <h3>Total Benefitted Patients</h3>
          <p>{stats.totalApprovedPatients}</p>
        </div>
      </div>
      <div className="policy-section">
        <h3>Approved Amounts by Policy</h3>
        <table className="policy-table">
          <thead>
            <tr>
              <th>Policy ID</th>
              <th>Approved Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.policyApprovedAmounts).map(([policyID, amount]) => (
              <tr key={policyID}>
                <td>{policyID}</td>
                <td>&#8377;{amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClaimStats;
