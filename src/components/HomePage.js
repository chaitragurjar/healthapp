import React from 'react';
import { Link } from 'react-router-dom';
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
      <motion.div layout onClick={() => setCitizenOpen(!citizenOpen)} className='card'>
        <motion.h2 layout='position'>
          <img src={citizen} alt="Icon" style={{ width: '30px', marginRight: '10px' }} />
          I am a Citizen
        </motion.h2>
        {citizenOpen &&
          (<motion.div className='expand'>
            <p>
              Hey citizen! We are here to help you with your policy details, claim filings and tracking.
            </p>
            <p>
              <button><Link to="/citizen-dashboard">Click Here to Login</Link></button>
            </p>
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
