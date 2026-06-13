'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '@/context/AppStateContext';

export default function AnalyticsDashboard() {
  const { students, selectedEvalCandidate, setActiveScreen } = useAppState();
  const student = selectedEvalCandidate || students[0]; // default to Ahmad Faris or uploaded candidate
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate numerical label from 0 to student.readiness
  useEffect(() => {
    setAnimatedScore(0);
    let start = 0;
    const end = student.readiness;
    if (start === end) {
      setAnimatedScore(end);
      return;
    }
    const totalDuration = 800; // ms
    const incrementTime = Math.max(Math.floor(totalDuration / end), 10);
    
    const timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [student.readiness]);

  // SVG parameters
  const radius = 75;
  const circumference = 2 * Math.PI * radius; // 471.2
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="view-panel active">
      <div className="flex-between mb-24">
        <div>
          <h2>Candidate Analytics Dashboard</h2>
          <p id="student-target-role-label">
            Insight engine analyzing alignment toward <strong>Target Role: {student.targetRole}</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveScreen('student-onboarding')}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Re-Upload Profile
        </button>
      </div>

      <div className="split-grid">
        {/* Left Card: Circular Progress Ring */}
        <div className="card">
          <div className="card-title">Adaptive Readiness Profile</div>
          <div className="progress-ring-container">
            <svg width="180" height="180" className="progress-ring-svg">
              <defs>
                <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <circle 
                className="progress-ring-circle-bg" 
                cx="90" 
                cy="90" 
                r={radius} 
                style={{
                  transform: 'rotate(-90deg) scaleY(-1)',
                  transformOrigin: 'center'
                }}
              />
              <circle 
                className="progress-ring-circle-fill" 
                id="readiness-progress-ring" 
                cx="90" 
                cy="90" 
                r={radius} 
                style={{
                  strokeDasharray: `${circumference} ${circumference}`,
                  strokeDashoffset: strokeDashoffset,
                  transform: 'rotate(-90deg) scaleY(-1)',
                  transformOrigin: 'center'
                }}
              />
              <text className="progress-ring-text" x="90" y="95" fontSize="22" id="readiness-numerical-label" textAnchor="middle">
                {animatedScore}%
              </text>
              <text x="90" y="120" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="700">
                JOB READY
              </text>
            </svg>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <span className="badge badge-verified">🟢 Strong Alignment</span>
              <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                Overall readiness is weighted across technical competencies, communications, and industry exposure indicators.
              </p>
            </div>
          </div>
        </div>

        {/* Right Card: Horizontal Bar Skill Mapping */}
        <div className="card">
          <div className="card-title">Skill Gap Analysis</div>
          <p className="mb-12" style={{ fontSize: '0.85rem' }}>
            Target Role requirements vs. current extracted skills:
          </p>
          <div id="student-skill-gap-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {student.skills.slice(0, 4).map((skill, idx) => (
              <div key={idx}>
                {skill.verified ? (
                  <>
                    <div className="flex-between mb-12">
                      <span className="mono-text">{skill.name}</span>
                      <div className="verified-text">🛡️ {skill.name} Verified</div>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '100%', backgroundColor: 'var(--state-verified)' }}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-between mb-12">
                      <span className="mono-text">{skill.name}</span>
                      <span style={{ color: 'var(--state-pending)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        ⚠️ 50% Gap
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '50%', backgroundColor: 'var(--state-pending)' }}></div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Banner Component: AI Insight */}
      <div className="ai-insight-banner">
        <h3>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          AI Insight: Hidden Skill Extractor
        </h3>
        <p id="dashboard-insight-text">
          <strong>AI Extraction Summary:</strong> {student.xai.summary}
        </p>
      </div>
    </div>
  );
}
