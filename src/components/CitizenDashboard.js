import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CitizenDashboard = () => {

  const location = useLocation();
  const { userId } = location.state || { userId: null };
  const [citizenName, setCitizenName] = useState('');

  useEffect(() => {
    const fetchCitizenData = async () => {
      try {
        const response = await fetch('/patients.json');
        const data = await response.json();
        const citizen = data.patients.find(c => c.patientID === userId);
        if (citizen) {
          setCitizenName(citizen.name);
        } else {
          setCitizenName('Guest');
        }
      } catch (error) {
        console.error('Error fetching the citizen data:', error);
      }
    };
    if (userId !== null) {
      fetchCitizenData();
    }
  }, [userId]);

  return (
    <div>
      <h1>Hello, {citizenName}!</h1>
      <button><Link to="/citizen/policy">View Policy Details</Link></button>
      <button><Link to="/file-claim">File a Claim</Link></button>
      <button><Link to="/claim-status">Track Claim Status</Link></button>
    </div>
  );
};

export default CitizenDashboard;
