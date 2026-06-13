'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/AppStateContext';

export default function CandidateEvaluation() {
  const { students, selectedEvalCandidate, shortlist, toggleShortlist, setActiveScreen } = useAppState();
  const student = selectedEvalCandidate || students[1]; // default Alice Tan

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [modalActive, setModalActive] = useState(false);

  const isShortlisted = shortlist.some(s => s.id === student.id);

  const handleShortlist = () => {
    toggleShortlist(student.id);
  };

  const handleFeedbackSubmit = () => {
    alert(`Feedback saved!\nRating: ${rating} Stars\nReview: "${comment}"`);
    setRating(0);
    setComment('');
  };

  return (
    <div className="view-panel active">
      <div className="flex-between mb-24">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setActiveScreen('employer-search')} style={{ padding: '8px 12px' }}>
            &larr; Back
          </button>
          <div>
            <h2 style={{ margin: 0 }}>{student.name}</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Major: {student.major}
            </p>
          </div>
        </div>
        <div className="flex-gap-16">
          <button 
            className={isShortlisted ? "btn btn-primary active" : "btn btn-secondary"}
            style={{
              backgroundColor: isShortlisted ? "var(--state-pending)" : "",
              color: isShortlisted ? "var(--text-light)" : ""
            }}
            onClick={handleShortlist}
          >
            {isShortlisted ? "★ Shortlisted" : "⭐ Add to Shortlist"}
          </button>
          <span className="candidate-match-score" style={{ fontSize: '1.5rem', display: 'inline-flex', alignItems: 'center', padding: '6px 12px', backgroundColor: 'var(--state-verified-bg)', borderRadius: '8px' }}>
            {student.compatibility}% Match
          </span>
        </div>
      </div>

      <div className="split-grid">
        {/* Left Card: Competencies progress bars */}
        <div className="card">
          <div className="card-title">Candidate Adaptive Competencies</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div className="flex-between mb-12">
                <span>Technical Skills</span>
                <strong>{student.competencies.technical}%</strong>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${student.competencies.technical}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between mb-12">
                <span>Analytical Capabilities</span>
                <strong>{student.competencies.analytical}%</strong>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${student.competencies.analytical}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between mb-12">
                <span>Communication Skills</span>
                <strong>{student.competencies.communication}%</strong>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${student.competencies.communication}%` }}></div>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary w-fill mt-24" onClick={() => setModalActive(true)}>
            Show Explainability Analysis Report
          </button>
        </div>

        {/* Right Card Area: Mockup Student Portfolio Viewport */}
        <div className="card">
          <div className="card-title">Embedded Student Portfolio Viewport</div>
          <div className="viewport-simulator" style={{ border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px', backgroundColor: 'var(--bg-canvas)' }}>
            <div style={{ backgroundColor: 'var(--primary-navy)', color: '#FFFFFF', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {student.portfolio.avatar}
                </div>
                <div>
                  <h4 style={{ color: '#FFFFFF', margin: 0 }}>{student.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Accredited Public Portfolio</span>
                </div>
              </div>
            </div>
            <h5 style={{ marginBottom: '8px' }}>Extracted & Verified Accomplishments</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {student.portfolio.accomplishments.map((acc, idx) => (
                <div className="card" key={idx} style={{ padding: '10px 14px', boxShadow: 'none', backgroundColor: 'var(--bg-card)' }}>
                  <div className="flex-between" style={{ fontSize: '0.8rem' }}>
                    <span>{acc.icon} <strong>{acc.title}</strong></span>
                    <span className="verified-text" style={{ color: 'var(--state-verified)' }}>🛡️ Verified</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Issuer: {acc.provider}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section Layer: Recruitment Feedback */}
      <div className="card mt-24">
        <div className="card-title">Recruitment Feedback Layer</div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Candidate Assessment Rating</label>
          <div className="star-rating" style={{ display: 'flex', gap: '6px', fontSize: '1.75rem', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                onClick={() => setRating(star)}
                style={{ color: star <= rating ? '#EAB308' : '#CBD5E1' }}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Recruiter Review / Feedback Notes</label>
          <textarea 
            className="form-input" 
            rows="4" 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter evaluation details, competency observations or action items..."
          />
        </div>
        <div style={{ textAlign: 'right', marginTop: '16px' }}>
          <button className="btn btn-primary" onClick={handleFeedbackSubmit}>Submit Feedback Form</button>
        </div>
      </div>

      {/* XAI Report Modal Popup */}
      {modalActive && (
        <div className="modal-overlay active" id="xai-report-modal">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>Explainability & Alignment Report</h3>
              <button className="modal-close" onClick={() => setModalActive(false)}>&times;</button>
            </div>
            <div>
              <p><strong>System Diagnostic:</strong> Detailed criteria mapping of the AI match engine matching profile competencies against market demands.</p>
              <div className="card" style={{ padding: '16px', margin: '16px 0', borderRadius: '10px', backgroundColor: 'var(--bg-canvas)' }}>
                <h4 style={{ marginBottom: '8px' }}>Fit Summary</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>{student.xai.summary}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h4 style={{ color: 'var(--state-verified)', marginBottom: '8px' }}>Mapped Strengths</h4>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    {student.xai.strengths.map((str, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{str}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--state-pending)', marginBottom: '8px' }}>Identified Gaps</h4>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    {student.xai.gaps.map((gap, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={() => setModalActive(false)}>Close Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
