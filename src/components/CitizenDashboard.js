import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { updateJsonData } from '../functionality/createClaim';
import './CitizenDashboard.css';

const CitizenDashboard = () => {

  const location = useLocation();
  const { userId } = location.state || { userId: null };
  const [citizenName, setCitizenName] = useState('');
  const [claimOpen, setClaimOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policy, setPolicy] = useState('');
  const [proof, setProof] = useState('');
  const [result, setResult] = useState('');
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);

  const fetchClaims = async () => {
    try {
      const response = await fetch('/claimStatus.json');
      const data = await response.json();
      const userClaims = data.claimStatus.filter(claim => claim.patientID === userId);
      setClaims(userClaims);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const trackClaims = () => {
    setStatusOpen(!statusOpen);
    if (!statusOpen) {
      fetchPolicy();
    }
  };

  const fetchPolicy = async () => {
    try {
      const response = await fetch('/policyMapping.json');
      const data = await response.json();
      const userPolicies = data.patientPolicyMapping.filter(claim => claim.patientID === userId);
      setPolicies(userPolicies);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const policyStatus = () => {
    setPolicyOpen(!policyOpen);
    if (!policyOpen) {
      fetchClaims();
    }
  };

  const submitClaim = async (event) => {
    event.preventDefault();

    const newEntry = {
      patientID: userId,
      policyID: policy,
      claimProof: proof,
      status: 'PENDING'
    };
    try {
      const updatedJson = updateJsonData(newEntry);
      setResult('Claim submitted successfully!');
      console.log('Updated JSON:', updatedJson);
    } catch (error) {
      console.error('Error fetching the citizen data:', error);
    }
  }

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
    <div className='CitizenDashboard'>

      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Borel&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet"></link>

      <motion.div layout='position' className="header">
        <h1>Hello, {citizenName}!</h1>
      </motion.div>

      <div className="citizen-card-container">
        <motion.div layout className='citizen-card'>
          <motion.h2 layout='position' onClick={() => setClaimOpen(!claimOpen)}>
            File a Claim
          </motion.h2>
          {claimOpen &&
            (<motion.div className='expand'>
              <form onSubmit={submitClaim}>
                <label> Policy :
                  <select value={policy} onChange={(e) => setPolicy(e.target.value)} required>
                    <option value="" disabled>Select a policy</option>
                    <option value="PM-JAY">PM-JAY</option>
                    <option value="MH-JAY">MH-JAY</option>
                  </select>
                </label>
                <br />
                <label> Proof :
                  <input type="text" value={proof} onChange={(e) => setProof(e.target.value)} required placeholder="Enter proof details" />
                </label>
                <br />
                <button type="submit">Click Here to Submit Claim</button>
              </form>
              {result && <p>{result}</p>}
            </motion.div>)
          }
        </motion.div>

        <motion.div layout className='citizen-card'>
          <motion.h2 layout='position' onClick={trackClaims}>
            Track Claims
          </motion.h2>
          {statusOpen &&
            (<motion.div className='expand'>
              <ul className='claims'>
                {claims.map((claim, index) => (
                  <li key={index} className={`claim-item ${claim.status === 'PENDING' ? 'pending' : 'approved'}`}>
                    <p>Policy ID: {claim.policyID}</p>
                    <p>Claim Proof: {claim.claimProof}</p>
                    <p>Status: {claim.status}</p>
                  </li>
                ))}
              </ul>
            </motion.div>)
          }
        </motion.div>

        <motion.div layout className='citizen-card'>
          <motion.h2 layout='position' onClick={policyStatus}>
            Check Policy Status
          </motion.h2>
          {policyOpen &&
            (<motion.div className='expand'>
              <ul className='policies'>
                {policies.map((policy, ind) => (
                  <li key={ind} className="policy-item">
                    <p>Policy: {policy.policyID}</p>
                    <p>Balance: {policy.limitAvailable}</p>
                  </li>
                ))}
              </ul>
            </motion.div>)
          }
        </motion.div>

      </div>

    </div>
  );
};

export default CitizenDashboard;
