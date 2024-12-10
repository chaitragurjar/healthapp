import React from 'react';
import { Link } from 'react-router-dom';

const HospitalDashboard = () => {
  return (
    <div>
      <h1>Hospital Dashboard</h1>
      <button><Link to="/hospital/verify-eligibility">Verify Patient Eligibility</Link></button>
      <button><Link to="/hospital/submit-treatment">Submit Treatment Details</Link></button>
      <button><Link to="/claim-status">Check Claim Status</Link></button>
    </div>
  );
};

export default HospitalDashboard;
