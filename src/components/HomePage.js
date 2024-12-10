import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Health Insurance App</h1>
      <button><Link to="/citizen-dashboard">Citizen Login</Link></button>
      <button><Link to="/hospital-dashboard">Hospital Login</Link></button>
      <button><Link to="/admin-dashboard">Admin Dashboard Login</Link></button>
      <button><Link to="/insurance/verify">Check Insurance Coverage</Link></button>
    </div>
  );
};

export default HomePage;  
