import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import './AdminDashboard.css';
import { updateJsonData } from '../functionality/createClaim';
import { transfer } from '../functionality/transferMoney';
import { validateTransaction } from '../functionality/validateHash';

const AdminDashboard = () => {

  const location = useLocation();
  const { userId } = location.state || { userId: null };
  const [statusOpen, setStatusOpen] = useState(false);
  const [claims, setClaims] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [validationResults, setValidationResults] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/admins.json');
        const data = await response.json();
        setAdmin(data.admins.find(c => c.adminID === userId));
      } catch (error) {
        console.error('Error fetching the citizen data:', error);
      }
    };
    if (userId !== null) {
      fetchAdminData();
    }
  }, [userId]);

  const fetchClaims = async () => {
    try {
      console.log(admin)
      const response = await fetch('/claimStatus.json');
      const data = await response.json();
      const userClaims = data.claimStatus.filter(claim => claim.policyID === admin.policyID);
      setClaims(userClaims);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const trackClaims = () => {
    setStatusOpen(!statusOpen);
    if (!statusOpen) {
      fetchClaims();
    }
  };

  const handleValidate = async (index, claim) => {
    // const isValid = await validateTransaction(claim.claimProof, claim.patientID, claim.hospitalID, claim.amount);
    // change button to show validation result
    // setValidationResults(prevResults => ({
    //   ...prevResults,
    //   [index]: isValid ? 'Valid' : 'Invalid'
    // }));
    setLoading(prev => ({ ...prev, [index]: true }));
    try {
      const isValid = await validateTransaction(claim.claimProof, claim.patientID, claim.hospitalID, claim.amount);
      setValidationResults(prev => ({ ...prev, [index]: isValid ? 'Valid' : 'Invalid' }));
    } catch (error) {
      setValidationResults(prev => ({ ...prev, [index]: 'Invalid' }));
      console.log("error is " + error);
    } finally {
      setLoading(prev => ({ ...prev, [index]: false })); // Set loading state to false
    }
  };

  const handleApprove = async (index, claim) => {

    const newEntry = {
      patientID: claim.patientID,
      hospitalID: claim.hospitalID,
      policyID: claim.policyID,
      claimProof: claim.claimProof,
      amount: claim.amount,
      status: 'APPROVED'
    };

    try {
      const updatedJson = updateJsonData(newEntry);
      setResult('Approved!');
      console.log('Updated JSON:', updatedJson);
    } catch (error) {
      console.error('Error fetching the citizen data:', error);
    }
    // const isValid = validateTransaction(claim);
    // setValidationResults(prevResults => ({
    //   ...prevResults,
    //   [index]: isValid ? 'Valid' : 'Invalid'
    // }));
  };

  const handleReject = async (index, claim) => {

    const newEntry = {
      patientID: claim.patientID,
      hospitalID: claim.hospitalID,
      policyID: claim.policyID,
      claimProof: claim.claimProof,
      amount: claim.amount,
      status: 'REJECTED'
    };

    try {
      const updatedJson = updateJsonData(newEntry);
      setResult('Rejected!');
      console.log('Updated JSON:', updatedJson);
    } catch (error) {
      console.error('Error fetching the citizen data:', error);
    }
  };

  return (
    <div className='AdminDashboard'>

      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Borel&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet"></link>

      <motion.div layout='position' className="header">
        <h1>Hello, {admin.name} Administring {admin.policyID}!</h1>
      </motion.div>

      <motion.div layout className='admin-card'>
        <motion.h2 layout='position' onClick={trackClaims}>
          Real-Time Claims
        </motion.h2>
        {statusOpen &&
          (<motion.div className='expand'>
            <ul className='claims'>
              {claims.map((claim, index) => (
                <li key={index} className={`claim-item 
                    ${claim.status === 'PENDING' ? 'pending' : ''} 
                    ${claim.status === 'APPROVED' ? 'approved' : ''} 
                    ${claim.status === 'REJECTED' ? 'rejected' : ''}`}>
                  <p>POLICY : {claim.policyID}</p>
                  <p>PROOF {claim.claimProof}</p>
                  <p>AMOUNT : {claim.amount}</p>
                  <p>STATUS : {claim.status}</p>

                  {claim.status === 'PENDING' && (
                    <button 
                      onClick={() => handleValidate(index, claim)}
                      disabled={!!validationResults[index]} 
                      style={{
                        backgroundColor: loading[index]
                          ? '#FEEE91'
                          : validationResults[index] === 'Valid'
                          ? '#5DB996'
                          : validationResults[index] === 'Invalid'
                          ? '#CC2B52'
                          : ''
                      }}
                    >
                      {/* {validationResults[index] || 'Validate XRPL'} */}
                      {loading[index] ? 'Processing...' : validationResults[index] || 'Validate XRPL'}
                    </button>
                  )}

                  {claim.status === 'PENDING' && (
                    <button onClick={() => handleApprove(index, claim)}>Approve</button>
                  )}

                  {claim.status === 'PENDING' && (
                    <button onClick={() => handleReject(index, claim)}>Reject</button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>)
        }
      </motion.div>

      {/* <h1>Admin Dashboard</h1>
      <button><Link to="/admin/reports">Check Claims Status</Link></button>
      <button><Link to="/admin/reports">Generate Reports</Link></button> */}
      {/* <button><Link to="/admin/manage-policy">Manage Policies and Schemes</Link></button> */}
    </div>
  );
};

export default AdminDashboard;
