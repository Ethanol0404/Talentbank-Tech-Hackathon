'use client';

import React from 'react';
import { useAppState } from '@/context/AppStateContext';
import { useTheme } from '@/context/ThemeContext';
import LandingGateway from '@/components/LandingGateway';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalSidebar from '@/components/GlobalSidebar';
import GlobalFooter from '@/components/GlobalFooter';

// Student Panels
import OnboardingWizard from '@/components/student/OnboardingWizard';
import AnalyticsDashboard from '@/components/student/AnalyticsDashboard';
import DiscoveryHub from '@/components/student/DiscoveryHub';
import LivingPortfolio from '@/components/student/LivingPortfolio';
import ATSBooster from '@/components/student/ATSBooster';

// University Panels
import CourseIntake from '@/components/university/CourseIntake';
import SkillMatrix from '@/components/university/SkillMatrix';
import CohortAnalytics from '@/components/university/CohortAnalytics';
import SyllabusInsights from '@/components/university/SyllabusInsights';

// Employer Panels
import TalentSearch from '@/components/employer/TalentSearch';
import CandidateEvaluation from '@/components/employer/CandidateEvaluation';
import ShortlistPipeline from '@/components/employer/ShortlistPipeline';

export default function Home() {
  const { activePersona, activeScreen } = useAppState();
  const { isDark } = useTheme();

  if (!activePersona) {
    return <LandingGateway />;
  }

  return (
    <div className="app-container" id="app-shell" style={{ display: 'grid' }}>
      <GlobalHeader />
      <GlobalSidebar />
      
      <main className="global-content">
        {/* Student Views */}
        {activeScreen === 'student-onboarding' && <OnboardingWizard />}
        {activeScreen === 'student-dashboard' && <AnalyticsDashboard />}
        {activeScreen === 'student-discovery' && <DiscoveryHub />}
        {activeScreen === 'student-portfolio' && <LivingPortfolio />}
        {activeScreen === 'student-booster' && <ATSBooster />}

        {/* University Views */}
        {activeScreen === 'university-intake' && <CourseIntake />}
        {activeScreen === 'university-matrix' && <SkillMatrix />}
        {activeScreen === 'university-analytics' && <CohortAnalytics />}
        {activeScreen === 'university-insights' && <SyllabusInsights />}

        {/* Employer Views */}
        {activeScreen === 'employer-search' && <TalentSearch />}
        {activeScreen === 'employer-candidate' && <CandidateEvaluation />}
        {activeScreen === 'employer-shortlist' && <ShortlistPipeline />}
      </main>

      <GlobalFooter />
    </div>
  );
}
