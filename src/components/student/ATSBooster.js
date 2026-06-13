'use client';

import React, { useState } from 'react';

export default function ATSBooster() {
  const [role, setRole] = useState('Data Scientist');
  const [bullets, setBullets] = useState(
    "helped build a customer churn prediction model using Python\nwas involved in cleaning and preprocessing dataset\nassisted in creating a dashboard in Tableau for the team"
  );
  const [loading, setLoading] = useState(false);
  const [optimized, setOptimized] = useState([]);

  const handleBoost = async () => {
    setLoading(true);
    setOptimized([]);

    // Simulate AI booster processing
    setTimeout(() => {
      const split = bullets.split('\n').filter(b => b.trim() !== '');
      const boosted = split.map((bullet) => {
        if (bullet.toLowerCase().includes('churn') || bullet.toLowerCase().includes('prediction')) {
          return `Engineered a customer churn prediction model in Python using Random Forests, improving retention predictions by 18% and guiding strategic save-campaigns.`;
        }
        if (bullet.toLowerCase().includes('cleaning') || bullet.toLowerCase().includes('dataset') || bullet.toLowerCase().includes('preprocess')) {
          return `Designed robust ETL and preprocessing pipelines for 10M+ records of unstructured user data, shortening ML model training cycles by 35%.`;
        }
        if (bullet.toLowerCase().includes('dashboard') || bullet.toLowerCase().includes('tableau') || bullet.toLowerCase().includes('viz')) {
          return `Developed interactive executive-facing dashboards in Tableau, driving daily business insights on performance metrics for cross-functional stakeholders.`;
        }
        return `Optimized achievement statement: Aligned "${bullet.trim()}" to target job role "${role}" requirements, implementing industry-standard quantitative metrics.`;
      });
      setOptimized(boosted);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="view-panel active">
      <div className="mb-24">
        <h2>AI Resume Booster & ATS Optimizer</h2>
        <p>Boost your resume bullet points using the Core AI rewriter aligned to target job role specifications.</p>
      </div>

      <div className="split-grid">
        {/* Left Column: Input */}
        <div className="card">
          <div className="card-title">Original Bullet Points</div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Target Job Role</label>
            <input 
              type="text" 
              className="form-input" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Software Engineer, DevOps, Product Manager..." 
            />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Raw Resume Bullets (One per line)</label>
            <textarea 
              className="form-input" 
              rows="8" 
              value={bullets}
              onChange={(e) => setBullets(e.target.value)}
              placeholder="helped build a customer churn prediction model using Python&#10;was involved in cleaning and preprocessing dataset&#10;assisted in creating a dashboard in Tableau for the team"
            />
          </div>
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleBoost}>+ Boost Achievements</button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="card">
          <div className="card-title">ATS Optimised Bullets</div>
          {loading ? (
            <div id="booster-loading-state" style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="status-dot" style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent-teal)' }}></div>
              <p style={{ marginTop: '12px' }}>AI Rewriter aligning statements to ATS specifications...</p>
            </div>
          ) : (
            <div id="booster-output-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {optimized.length > 0 ? (
                optimized.map((bullet, idx) => (
                  <div key={idx} className="card" style={{ padding: '14px', borderLeft: '4px solid var(--accent-teal)' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{bullet}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Enter your raw bullets and click 'Boost Achievements' to see optimized versions.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
