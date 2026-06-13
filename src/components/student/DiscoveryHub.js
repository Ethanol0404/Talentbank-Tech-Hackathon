'use client';

import React, { useState } from 'react';

export default function DiscoveryHub() {
  const [modalActive, setModalActive] = useState(false);
  const [simulationChoice, setSimulationChoice] = useState(null); // 'correct', 'partial', 'incorrect', or null

  const handleLaunch = () => {
    setSimulationChoice(null);
    setModalActive(true);
  };

  const handleChoice = (choice) => {
    setSimulationChoice(choice);
  };

  return (
    <div className="view-panel active">
      {/* Top Action Hero Banner */}
      <div className="ai-insight-banner mb-24" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '70%' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem' }}>Bridge Your Career Gaps with Interactive Simulations</h3>
          <p style={{ color: '#E2E8F0', marginTop: '6px' }}>
            Engage in real-time workplace scenarios tailored to test and verify your Data Visualization and Tableau dashboard capabilities.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleLaunch} 
          style={{ backgroundColor: 'var(--accent-light-blue)', color: 'var(--primary-navy)' }}
        >
          Launch Career Simulation
        </button>
      </div>

      <h3 className="mb-12">Recommendation Engine Paths</h3>
      <div className="three-column-grid">
        {/* Column 1: Matched Jobs */}
        <div className="card">
          <div className="card-title">Matched Jobs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => alert('Applied to AmanPay!')}>
              <h4>FinTech Data Analyst</h4>
              <p style={{ fontSize: '0.8rem', margin: '6px 0' }}>AmanPay Sourcing • Kuala Lumpur</p>
              <div className="flex-between">
                <span className="badge badge-verified">92% Match</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600 }}>View Job &rarr;</span>
              </div>
            </div>
            <div className="card" style={{ padding: '16px', cursor: 'pointer' }}>
              <h4>Business System Engineer</h4>
              <p style={{ fontSize: '0.8rem', margin: '6px 0' }}>Digital Innovation Corp</p>
              <div className="flex-between">
                <span className="badge badge-verified">85% Match</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600 }}>View Job &rarr;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Up-skilling Courses */}
        <div className="card">
          <div className="card-title">Up-skilling Courses</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h4>Advanced Tableau Master</h4>
              <p style={{ fontSize: '0.8rem', margin: '6px 0', color: 'var(--state-pending)' }}>Closes Data Viz Gap (Medium Priority)</p>
              <div className="flex-between">
                <span className="mono-text">4 Hours • Udemy</span>
                <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Enroll</button>
              </div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <h4>Data Warehouse Engineering</h4>
              <p style={{ fontSize: '0.8rem', margin: '6px 0', color: 'var(--text-muted)' }}>Optional Exposure</p>
              <div className="flex-between">
                <span className="mono-text">12 Hours • Coursera</span>
                <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Enroll</button>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Suggested Projects */}
        <div className="card">
          <div className="card-title">Suggested Projects</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h4>Financial Analytics Dashboard</h4>
              <p style={{ fontSize: '0.8rem', margin: '6px 0' }}>Build an automated python pipeline visualizing churn trends.</p>
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => alert('Simulation Workspace Ready!')}>
                  Deploy Sandbox
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Modal */}
      {modalActive && (
        <div className="modal-overlay active" id="simulation-modal">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>UniOS Simulation Lab: Tableau Dashboard</h3>
              <button className="modal-close" onClick={() => setModalActive(false)}>&times;</button>
            </div>
            
            {simulationChoice === null ? (
              <div id="simulation-step-1">
                <p className="mb-12">
                  <strong>Workplace Scenario:</strong> You are tasked with designing a dashboard showing client churn. How should you partition the key dimensions for the executive team?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
                  <button 
                    className="btn btn-secondary w-fill" 
                    onClick={() => handleChoice('incorrect')} 
                    style={{ textAlign: 'left' }}
                  >
                    A. Display all 50 columns on a single scatter plot grid
                  </button>
                  <button 
                    className="btn btn-secondary w-fill" 
                    onClick={() => handleChoice('correct')} 
                    style={{ textAlign: 'left' }}
                  >
                    B. Create a high-level KPI summary card linked to interactive filtering sheets
                  </button>
                  <button 
                    className="btn btn-secondary w-fill" 
                    onClick={() => handleChoice('partial')} 
                    style={{ textAlign: 'left' }}
                  >
                    C. Build a static bar chart and send it weekly via email
                  </button>
                </div>
              </div>
            ) : (
              <div id="simulation-feedback">
                <div className="card" id="simulation-feedback-card" style={{ padding: '16px', marginBottom: '16px', borderRadius: '8px' }}>
                  {simulationChoice === 'correct' && (
                    <>
                      <h4 style={{ color: 'var(--state-verified)', marginBottom: '8px' }}>🟢 Option B: Optimal Choice!</h4>
                      <p>
                        Creating summary KPI cards combined with drill-down worksheets provides an outstanding user experience for executives. It hides unnecessary data noise while enabling analytical deep-dives. This increases your <strong>Analytical Score</strong> by <strong>+10%</strong>!
                      </p>
                    </>
                  )}
                  {simulationChoice === 'partial' && (
                    <>
                      <h4 style={{ color: 'var(--state-pending)', marginBottom: '8px' }}>🟡 Option C: Sub-optimal (Partial credit)</h4>
                      <p>
                        Static reports can be useful, but they don't allow executives to filter data interactively. Consider utilizing interactive dashboard capabilities for dashboard design tasks.
                      </p>
                    </>
                  )}
                  {simulationChoice === 'incorrect' && (
                    <>
                      <h4 style={{ color: 'var(--state-gap)', marginBottom: '8px' }}>🔴 Option A: Poor Alignment</h4>
                      <p>
                        Executives require high-level summaries. Displaying all 50 dimensions on a single scatter plot creates visual overload and clutter. Try structuring your layouts with hierarchy.
                      </p>
                    </>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary" onClick={() => setModalActive(false)}>Finish Sandbox Session</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
