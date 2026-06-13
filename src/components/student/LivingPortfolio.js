'use client';

import React from 'react';
import { useAppState } from '@/context/AppStateContext';

export default function LivingPortfolio() {
  const { students, selectedEvalCandidate } = useAppState();
  const student = selectedEvalCandidate || students[0];

  const handleShare = () => {
    alert(`Profile share link copied to clipboard: https://unios.app/portfolio/${student.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="view-panel active">
      <div className="card mb-24" style={{ backgroundColor: '#0B192C', color: '#FFFFFF' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyPoint: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
              {student.portfolio.avatar}
            </div>
            <div>
              <h2 style={{ color: '#FFFFFF', margin: 0 }}>{student.name}</h2>
              <p style={{ color: '#94A3B8', margin: '4px 0 0 0' }}>{student.major} | Target: {student.targetRole}</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleShare} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            Copy Profile Link
          </button>
        </div>
      </div>

      <h3 className="mb-12">Verified Badges & Accomplishments</h3>
      <div className="three-column-grid" id="portfolio-badges-grid">
        {student.portfolio.accomplishments.map((acc, idx) => (
          <div className="card" key={idx}>
            <div className="flex-between mb-12">
              <span className="badge badge-verified">🛡️ Faculty Verified</span>
              <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>Portfolio Verified</span>
            </div>
            <h4 className="mb-12" style={{ fontSize: '1.05rem' }}>{acc.title}</h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Verified by: <strong>{acc.provider}</strong>
            </div>
            <div className="flex-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
              <a href="#" className="mono-text" onClick={(e) => { e.preventDefault(); alert('Redirecting to repo...'); }} style={{ color: 'var(--accent-blue)', decoration: 'none', textDecoration: 'none', fontSize: '0.75rem' }}>Repository &rarr;</a>
              <a href="#" className="mono-text" onClick={(e) => { e.preventDefault(); alert(`Proof Document: ${acc.doc}`); }} style={{ color: 'var(--accent-blue)', decoration: 'none', textDecoration: 'none', fontSize: '0.75rem' }}>Proof Document</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
