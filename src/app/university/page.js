'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/context/AppStateContext';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSidebar from '@/components/GlobalSidebar';
import GlobalFooter from '@/components/GlobalFooter';

// University Panels
import CourseIntake from '@/components/university/CourseIntake';
import SkillMatrix from '@/components/university/SkillMatrix';
import CohortAnalytics from '@/components/university/CohortAnalytics';
import SyllabusInsights from '@/components/university/SyllabusInsights';

export default function UniversityDashboardPage() {
  const { activePersona, activeScreen, enterPersona } = useAppState();

  useEffect(() => {
    enterPersona('university');
  }, []);

  if (activePersona !== 'university') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-canvas)', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--accent-blue)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
          <div>Loading workspace...</div>
          <style jsx global>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" id="app-shell" style={{ display: 'grid' }}>
      <GlobalHeader />
      <GlobalSidebar />

      <main className="global-content">
        {activeScreen === 'university-intake' && <CourseIntake />}
        {activeScreen === 'university-matrix' && <SkillMatrix />}
        {activeScreen === 'university-analytics' && <CohortAnalytics />}
        {activeScreen === 'university-insights' && <SyllabusInsights />}
      </main>

      <GlobalFooter />
    </div>
  );
}
