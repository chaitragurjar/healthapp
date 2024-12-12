import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import { useState } from 'react';
import './HomePage.css';
import citizen from '../static/citizen.png';
import hospital from '../static/hospital.png';
import admin from '../static/admin.png';
import focusimage from '../static/focusimage.png';

const HomePage = () => {

  const [citizenOpen, setCitizenOpen] = useState(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/users.json');
      console.log(response)
      const data = await response.json();
      const users = data.users;
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        navigate('/citizen-dashboard', { state: { username } });
        setResult('Login successful!');
        console.log('Login Successful');
      } else {
        setResult('Login failed. Incorrect username or password.');
        console.log('Login Failed');
      }
    } catch (error) {
      console.error('Error fetching the users:', error);
      setResult('An error occurred while trying to log in.');
    }
  }

  return (
    <div className='HomePage'>
      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Borel&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet"></link>

      <div className='left'>
        <motion.div layout='position' className="header">
          <h1 >Welcome to SweChai's Health Insurance App </h1>
        </motion.div>

        <div className="card-container">
          <motion.div layout  className='card'>
            <motion.h2 layout='position' onClick={() => setCitizenOpen(!citizenOpen)}>
              <img src={citizen} alt="Icon" style={{ width: '30px', marginRight: '10px' }} />
              I am a Citizen
            </motion.h2>
            {citizenOpen &&
              (<motion.div className='expand'>
                <p>
                  Hey citizen! We are here to help you with your policy details, claim filings and tracking.
                </p>
                <form onSubmit={handleSubmit}>
                  <label> Username:  
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </label>
                  <br />
                  <label> Password:  
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </label>
                  <br />
                  <button type="submit">Click Here to Login</button>
                </form>
                <p>{result}</p>
              </motion.div>)
            }
          </motion.div>

          <motion.div layout onClick={() => setHospitalOpen(!hospitalOpen)} className='card'>
            <motion.h2 layout='position'>
              <img src={hospital} alt="Icon" style={{ width: '40px', marginRight: '10px' }} />
              This is the Hospital
            </motion.h2>
            {hospitalOpen &&
              (<motion.div className='expand'>
                <p>
                  We help you verify patient eligibility, submit treatment details and check status of claims. Patients first!
                </p>
                <p>
                  <button><Link to="/hospital-dashboard">Click Here to Login</Link></button>
                </p>
              </motion.div>)
            }
          </motion.div>

          <motion.div layout onClick={() => setAdminOpen(!adminOpen)} className='card'>
            <motion.h2 layout='position'>
              <img src={admin} alt="Icon" style={{ width: '35px', marginRight: '10px' }} />
              Administrator
            </motion.h2>
            {adminOpen &&
              (<motion.div className='expand'>
                <p>
                  Turn these wheels to watch claims, generate reports and manage policies.
                </p>
                <p>
                  <button><Link to="/admin-dashboard">Click Here to Login</Link></button>
                </p>
              </motion.div>)
            }
          </motion.div>

        </div>
      </div>

      <div className='right'>
        <img src={focusimage} alt="Icon" />
      </div>
    </div>
  );
};

export default HomePage;  
