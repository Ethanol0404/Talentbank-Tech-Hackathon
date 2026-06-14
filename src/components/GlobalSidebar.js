'use client';

import React from 'react';
import { useAppState } from '@/context/AppStateContext';
import { useRouter } from 'next/navigation';

export default function GlobalSidebar() {
  const { activePersona, activeScreen, setActiveScreen, enterPersona, currentUser } = useAppState();
  const router = useRouter();

  const handleLogoClick = () => {
    if (currentUser) {
      if (currentUser.role === 'candidate') router.push('/candidate');
      else if (currentUser.role === 'university') router.push('/university');
      else if (currentUser.role === 'employer') router.push('/employer');
    } else {
      enterPersona('');
      router.push('/');
    }
  };

  const menuConfig = {
    student: [
      { id: "student-onboarding", label: "Onboarding Wizard", icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "student-dashboard", label: "Candidate Dashboard", icon: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "student-discovery", label: "Discovery Hub", icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "student-portfolio", label: "Living Portfolio", icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "student-booster", label: "AI Resume Booster", icon: <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> }
    ],
    university: [
      { id: "university-intake", label: "Course Intake", icon: <path d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "university-matrix", label: "Skill Mapping Matrix", icon: <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "university-insights", label: "Curriculum Insights", icon: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "university-analytics", label: "Cohort Analytics", icon: <path d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> }
    ],
    employer: [
      { id: "employer-search", label: "Search Directory", icon: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "employer-candidate", label: "Deep Evaluation", icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
      { id: "employer-shortlist", label: "Shortlist Pipeline", icon: <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> }
    ]
  };

  const listItems = menuConfig[activePersona] || [];

  return (
    <aside className="global-sidebar" id="global-sidebar">
      <div className="sidebar-header">
        <div className="logo logo-clickable" onClick={handleLogoClick} title={currentUser ? "Dashboard" : "Exit View"} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.jpg" alt="UniOS Logo" style={{ height: '32px', borderRadius: '6px' }} />
          <span className="logo-text">UniOS</span>
        </div>
      </div>
      
      <ul className="sidebar-menu" id="sidebar-menu-list">
        {listItems.map((item) => (
          <li key={item.id} id={`sidebar-li-${item.id}`} className={activeScreen === item.id ? 'active' : ''}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveScreen(item.id); }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
