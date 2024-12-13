import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HospitalDashboard = () => {

  const location = useLocation();
  const { userId } = location.state || { userId: null };
  console.log(userId);
  const [hospitalName, setHospitalName] = useState('');

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await fetch('/hospitals.json');
        const data = await response.json();
        const hospital = data.hospitals.find(h => h.hospitalID === userId);
        console.log(hospital);
        if (hospital) {
          console.log(hospital);
          setHospitalName(hospital.name);
        } else {
          setHospitalName('Guest');
        }
      } catch (error) {
        console.error('Error fetching the hospital data:', error);
      }
    };
    if (userId !== null) {
      fetchHospitalData();
    }
  }, [userId]);

  return (
    <div>
      <h1>Hello, {hospitalName}!</h1>
      <button><Link to="/hospital/verify-eligibility">Verify Patient Eligibility</Link></button>
      <button><Link to="/hospital/submit-treatment">Submit Treatment Details</Link></button>
      <button><Link to="/claim-status">Check Claim Status</Link></button>
    </div>
  );
};

export default HospitalDashboard;
