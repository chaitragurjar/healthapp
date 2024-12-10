import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import CitizenDashboard from './components/CitizenDashboard';
import HospitalDashboard from './components/HospitalDashboard';
import AdminDashboard from './components/AdminDashboard';
import ClaimFilingPage from './components/ClaimFilingPage';
import ClaimStatusPage from './components/ClaimStatusPage';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/file-claim" element={<ClaimFilingPage />} />
        <Route path="/claim-status" element={<ClaimStatusPage />} />
      </Routes>
    </Router>
    // </div>
    
  );
}

export default App;
