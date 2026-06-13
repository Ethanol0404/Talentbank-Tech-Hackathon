'use client';

import React from 'react';
import { useAppState } from '@/context/AppStateContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function LandingGateway() {
  const { enterPersona } = useAppState();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="landing-gateway" id="landing-page" style={{ position: 'relative' }}>
      {/* Floating Theme Toggle for Landing Page */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 1000 }}>
        <button 
          className="btn-icon-only theme-toggle-landing" 
          id="theme-toggle-btn-landing" 
          aria-label="Toggle Dark Mode" 
          onClick={toggleTheme}
          style={{
            borderRadius: '50%',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
          }}
        >
          <svg id="theme-icon-landing" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isDark ? (
              // Sun icon when dark theme is active
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828-9.9l-.707-.707m12.728 12.728l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
            ) : (
              // Moon icon when light theme is active
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            )}
          </svg>
        </button>
      </div>

      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src="/logo.jpg" alt="UniOS Logo" style={{ height: '100px', borderRadius: '16px', display: 'block', margin: '0 auto 20px auto', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)' }} />
        <h1>Welcome to UniOS</h1>
        <p>The Data-Driven Talent Alignment Ecosystem</p>
      </motion.div>

      {/* Core 3-Column Grid */}
      <div className="three-column-grid">
        {/* Card 1: Student View */}
        <motion.div 
          className="gateway-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="gateway-icon">
            <svg viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h2>Student View</h2>
          <p>Analyze your workplace readiness, explore custom recommendations, and compile a public portfolio.</p>
          <ul className="gateway-features">
            <li>Upload Resumes/Docs</li>
            <li>View Skill Gaps</li>
            <li>Interactive Simulations</li>
            <li>Living Portfolio Sharing</li>
            <li>AI Resume Booster and ATS</li>
          </ul>
          <button className="btn btn-primary w-fill" onClick={() => enterPersona('student')}>Enter Student View</button>
        </motion.div>

        {/* Card 2: University View */}
        <motion.div 
          className="gateway-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="gateway-icon">
            <svg viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
            </svg>
          </div>
          <h2>University View</h2>
          <p>Leverage AI models to scan program syllabus, optimize mapped outcomes, and view cohort analytics.</p>
          <ul className="gateway-features">
            <li>Parse Course Syllabus</li>
            <li>Curriculum Insights</li>
            <li>Heatmap Mapping Matrix</li>
            <li>Cohort Skill Trends</li>
          </ul>
          <button className="btn btn-primary w-fill" onClick={() => enterPersona('university')}>Enter Lecturer View</button>
        </motion.div>

        {/* Card 3: Employer View */}
        <motion.div 
          className="gateway-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="gateway-icon">
            <svg viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2>Employer View</h2>
          <p>Access high-fidelity talent directories with verified skill credentials and deep compatibility matrices.</p>
          <ul className="gateway-features">
            <li>Advanced Talent Search</li>
            <li>Check Readiness Scores</li>
            <li>Skill Shield Verification</li>
            <li>Candidate Assessment Rating</li>
          </ul>
          <button className="btn btn-primary w-fill" onClick={() => enterPersona('employer')}>Enter Recruiter View</button>
        </motion.div>
      </div>
    </div>
  );
}

