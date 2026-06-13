'use client';

import React from 'react';
import { useAppState } from '@/context/AppStateContext';
import { useTheme } from '@/context/ThemeContext';

export default function GlobalHeader() {
  const { activePersona, enterPersona, selectedEvalCandidate } = useAppState();
  const { isDark, toggleTheme } = useTheme();

  const handleExit = () => {
    enterPersona('');
  };

  const getPersonaLabel = () => {
    if (activePersona === 'student') return 'Student View';
    if (activePersona === 'university') return 'Lecturer View';
    if (activePersona === 'employer') return 'Recruiter View';
    return '';
  };

  const getUserDetails = () => {
    if (activePersona === 'student') {
      const name = selectedEvalCandidate ? selectedEvalCandidate.name : 'Ahmad Faris';
      const initials = selectedEvalCandidate ? selectedEvalCandidate.portfolio.avatar : 'AF';
      return { name, initials };
    }
    if (activePersona === 'university') {
      return { name: 'Lecturer Account', initials: 'L' };
    }
    return { name: 'Recruiter Portal', initials: 'R' };
  };

  const user = getUserDetails();

  const handleSidebarToggle = () => {
    const shell = document.getElementById('app-shell');
    if (shell) {
      shell.classList.toggle('collapsed');
    }
  };

  return (
    <header className="global-header" id="global-header">
      <div className="header-left">
        <button className="sidebar-toggle" id="sidebar-toggle-btn" aria-label="Toggle Navigation Sidebar" onClick={handleSidebarToggle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="logo-clickable" onClick={handleExit} title="Exit View" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="logo.jpg" alt="UniOS Logo" style={{ height: '32px', verticalAlign: 'middle', marginRight: '8px', borderRadius: '6px' }} />
          <span className="logo-text">
            UniOS 
            <span id="header-persona-label" style={{ color: 'var(--accent-blue)', fontSize: '0.95rem', fontWeight: 600, marginLeft: '8px' }}>
              {getPersonaLabel()}
            </span>
          </span>
        </div>
      </div>

      {/* Active Persona Switcher Tab Selector */}
      <div className="header-center">
        <button 
          className={`persona-btn ${activePersona === 'student' ? 'active' : ''}`} 
          onClick={() => enterPersona('student')}
        >
          Student View
        </button>
        <button 
          className={`persona-btn ${activePersona === 'university' ? 'active' : ''}`} 
          onClick={() => enterPersona('university')}
        >
          Lecturer View
        </button>
        <button 
          className={`persona-btn ${activePersona === 'employer' ? 'active' : ''}`} 
          onClick={() => enterPersona('employer')}
        >
          Recruiter View
        </button>
      </div>

      <div className="header-right">
        <button className="btn-icon-only" id="theme-toggle-btn" aria-label="Toggle Dark Mode" onClick={toggleTheme} style={{ borderRadius: '50%' }}>
          <svg id="theme-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isDark ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828-9.9l-.707-.707m12.728 12.728l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            )}
          </svg>
        </button>
        <div className="user-profile-badge">
          <span className="user-profile-avatar" id="user-avatar-initial">{user.initials}</span>
          <span id="user-display-name">{user.name}</span>
        </div>
        <button className="btn btn-secondary" onClick={handleExit} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Exit View</button>
      </div>
    </header>
  );
}
