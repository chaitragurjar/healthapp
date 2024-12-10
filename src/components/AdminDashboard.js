import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button><Link to="/admin/reports">Real-Time Claims Status</Link></button>
      <button><Link to="/admin/reports">Generate Reports</Link></button>
      <button><Link to="/admin/manage-policy">Manage Policies and Schemes</Link></button>
    </div>
  );
};

export default AdminDashboard;
