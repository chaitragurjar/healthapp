import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { updateJsonData } from '../functionality/createClaim';
import { transfer } from '../functionality/transferMoney';
import './CitizenDashboard.css';
import fileclaim from '../static/fileclaim.png';
import trackclaim from '../static/trackclaim.png';
import limit from '../static/limit.png'

const CitizenDashboard = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || { userId: null };
  const [citizenName, setCitizenName] = useState('');
  const [claimOpen, setClaimOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policy, setPolicy] = useState('');
  const [proof, setProof] = useState('');
  const [hospitalID, setHospitalID] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      fetchClaims();
    }
  };



  const fetchPolicy = async () => {
    try {
      const response = await fetch('/policyMapping.json');
      const policyData = await response.json();
      const userPolicies = policyData.patientPolicyMapping.filter(policy => policy.patientID === userId);

      const claimsResponse = await fetch('/claimStatus.json');
      const claimsData = await claimsResponse.json();
      const policyApprovedAmounts = claimsData.claimStatus.reduce((acc, claim) => {
        if (claim.patientID === userId && claim.status === 'APPROVED') {
          acc[claim.policyID] = (acc[claim.policyID] || 0) + claim.amount;
        }
        return acc;
      }, {});

      const enrichedPolicies = userPolicies.map(policy => ({
        ...policy,
        approvedAmount: policyApprovedAmounts[policy.policyID] || 0,
      }));

      setPolicies(enrichedPolicies);
    } catch (error) {
      console.error('Error fetching policies or claims:', error);
    }
  };


  const policyStatus = () => {
    setPolicyOpen(!policyOpen);
    if (!policyOpen) {
      fetchPolicy();

    }
  };

  const submitClaim = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const proof = await transfer(userId, parseInt(hospitalID, 10), amount);
      setProof(proof);

      console.log("Funds transferred successfully:", proof);

      const newEntry = {
        patientID: userId,
        hospitalID: hospitalID,
        policyID: policy,
        claimProof: proof,
        amount: parseInt(amount, 10),
        status: 'PENDING'
      };
      console.log(newEntry)

      const updatedJson = updateJsonData(newEntry);
      setResult('Claim submitted successfully! ' + proof);
      console.log('Updated JSON:', updatedJson);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during the process:", error.message);
      setIsSubmitting(false);
    }
  }

  useEffect(() => {

    const hospitalID = Math.random() < 0.5 ? 1 : 2;
    setHospitalID(hospitalID);

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
      fetchPolicy();
    }
  }, [userId]);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className='CitizenDashboard'>

      <button onClick={handleLogout} className="logout-button">Logout</button>

      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Borel&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet"></link>

      <motion.div layout='position' className="header">
        <h1>Hello, {citizenName}!</h1>
      </motion.div>

      <div className="citizen-card-container">
        <motion.div layout className='citizen-card'>
          <motion.h2 layout='position' onClick={() => setClaimOpen(!claimOpen)}>
            <img src={fileclaim} alt="Icon" style={{ width: '30px', marginRight: '10px' }} />
            File a Claim
          </motion.h2>
          {claimOpen &&
            (<motion.div className='expand'>
              <form onSubmit={submitClaim}>
                <label> Policy :
                  <select value={policy} onChange={(e) => setPolicy(e.target.value)} required>
                    <option value="" disabled>Select a policy</option>
                    {policies.map((mapping, index) => (
                      <option key={index} value={mapping.policyID}>{mapping.policyID}</option>
                    ))}
                  </select>
                </label>
                <br />
                <label> Hopital ID :
                  <select value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required>
                    <option value="" disabled>Select a Hospital</option>
                    <option value="Fortis Mumbai">Fortis Research Mumbai</option>
                    <option value="Hiranandani Mumbai">Hiranandani Hospital Mumbai</option>
                    <option value="AIIMS Delhi">AIIMS Delhi</option>
                    <option value="Apollo Bangalore">Apollo HealthCare Bangalore</option>
                  </select>
                  {/* <input type="number" value={hospitalID} onChange={(e) => setHospitalID(e.target.value)} required placeholder="Enter Hospital ID" /> */}
                </label>

                <br />
                <label> Amount :
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="Enter amount" />
                </label>
                <br />
                <button type="submit" style={{ backgroundColor: isSubmitting ? '#FEEE91' : '#8eecf5' }} >
                  {isSubmitting ? 'Processing...' : 'Click Here to Pay and Submit Claim'}
                </button>
              </form>
              {result && <p>{result}</p>}
            </motion.div>)
          }
        </motion.div>

        <motion.div layout className='citizen-card'>
          <motion.h2 layout='position' onClick={trackClaims}>
            <img src={trackclaim} alt="Icon" style={{ width: '30px', marginRight: '10px' }} />
            Track Claims
          </motion.h2>
          {statusOpen &&
            (<motion.div className='expand'>
              <ul className='claims'>
                {claims.map((claim, index) => (
                  <li key={index} className={`claim-item 
                    ${claim.status === 'PENDING' ? 'pending' : ''} 
                    ${claim.status === 'APPROVED' ? 'approved' : ''} 
                    ${claim.status === 'REJECTED' ? 'rejected' : ''}`}>
                    <div className="claim-card">
                      <h4 className="claim-policy">Policy: {claim.policyID}</h4>
                      <div className="claim-details">
                        <p><strong>Hospital ID:</strong> {claim.hospitalID}</p>
                        <p><strong>Proof:</strong> {claim.claimProof}</p>
                        <p><strong>Amount:</strong> &#8377;{claim.amount}</p>
                        <p><strong>Status:</strong> {claim.status}</p>
                      </div>
                    </div>

                  </li>
                ))}
              </ul>
            </motion.div>)
          }
        </motion.div>

        <motion.div layout className='citizen-card'>
          <motion.h2 layout='position' onClick={policyStatus}>
            <img src={limit} alt="Icon" style={{ width: '30px', marginRight: '10px' }} />
            Check Policy Status
          </motion.h2>
          {policyOpen &&
            (<motion.div className='expand'>
              <ul className='policies'>
                {policies.map((policy, ind) => (
                  <li key={ind} className="policy-item">
                    <div className="policy-card">
                      <div className="policy-header">
                        <h3 className="policy-id">{policy.policyID} Policy</h3>
                      </div>
                      <div className="policy-details">
                        <p><strong>Total Limit:</strong> &#8377;{policy.limitAvailable}</p>
                        <p><strong>Available:</strong> &#8377;{policy.limitAvailable - policy.approvedAmount}</p>
                      </div>
                    </div>
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
