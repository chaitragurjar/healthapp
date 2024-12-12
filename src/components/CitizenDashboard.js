import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const CitizenDashboard = () => {

  const location = useLocation();
  const { username } = location.state || { username: 'Guest' };

  return (
    <div>
      <h1>Hello, {username}!</h1>
      <button><Link to="/citizen/policy">View Policy Details</Link></button>
      <button><Link to="/file-claim">File a Claim</Link></button>
      <button><Link to="/claim-status">Track Claim Status</Link></button>
    </div>
  );
};

export default CitizenDashboard;
