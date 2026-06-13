'use client';

import React, { useState } from 'react';

export default function CourseIntake() {
  const [modalActive, setModalActive] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(55);
  const [statusLabel, setStatusLabel] = useState('Text Extraction Complete (55%)');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const openModal = () => {
    setModalActive(true);
    setParsingProgress(55);
    setStatusLabel('Text Extraction Complete (55%)');
    setButtonDisabled(true);

    setTimeout(() => {
      setParsingProgress(85);
      setStatusLabel('AI Alignment Parser analysis (85%)');
    }, 1000);

    setTimeout(() => {
      setParsingProgress(100);
      setStatusLabel('Parsing Complete (100%)');
      setButtonDisabled(false);
    }, 2200);
  };

  const handleFinish = () => {
    setModalActive(false);
    alert('Syllabus alignments imported successfully! Map Matrix updated.');
  };

  const courses = [
    { code: "SEC-3013", name: "Structured SQL Database Querying", map: "SQL Core, Index Tuning", scan: "2026-06-10", status: "Mapped" },
    { code: "SEC-3022", name: "Agile Project Management Systems", map: "Scrum Frameworks, Kanban", scan: "2026-06-11", status: "Mapped" },
    { code: "SEC-4001", name: "Cloud Labs & Infrastructure Design", map: "AWS, Docker deployments", scan: "2026-06-13", status: "Processing" }
  ];

  return (
    <div className="view-panel active">
      <div className="flex-between mb-24">
        <div>
          <h2>Course Management & Document Intake</h2>
          <p>Academic admin workspace to parse syllabi and align curriculum outcomes</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>+ Upload Course Syllabus</button>
      </div>

      <div className="card">
        <div className="card-title">Active Program Modules</div>
        <div className="matrix-container">
          <table className="matrix-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px', textAlign: 'center' }}>Course Code</th>
                <th style={{ padding: '14px', textAlign: 'center' }}>Course Name</th>
                <th style={{ padding: '14px', textAlign: 'center' }}>CLO-PLO Target Matrix</th>
                <th style={{ padding: '14px', textAlign: 'center' }}>Last Scanned</th>
                <th style={{ padding: '14px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, idx) => (
                <tr key={idx}>
                  <td className="mono-text" style={{ fontWeight: 700, padding: '14px', textAlign: 'center' }}>{c.code}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>{c.name}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}><span className="mono-text">{c.map}</span></td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>{c.scan}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {c.status === "Mapped" ? (
                      <span style={{ color: 'var(--state-verified)' }}>🟢 Fully Mapped</span>
                    ) : (
                      <span style={{ color: 'var(--state-pending)' }}>🟡 Processing AI</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Syllabus Parser Modal Popup Overlay */}
      {modalActive && (
        <div className="modal-overlay active" id="syllabus-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>AI Syllabus Parser Interface</h3>
              <button className="modal-close" onClick={() => setModalActive(false)}>&times;</button>
            </div>
            <div>
              <p>Extracting curriculum alignments and course learning outcomes (CLO) from uploaded document...</p>
              <div className="progress-bar-container" style={{ marginTop: '24px' }}>
                <div className="progress-bar-fill" style={{ width: `${parsingProgress}%` }}></div>
              </div>
              <div className="flex-between">
                <span className="mono-text" style={{ fontSize: '0.8rem' }} id="syllabus-status-label">{statusLabel}</span>
                <span className="mono-text" style={{ fontSize: '0.8rem' }}>Processing AI...</span>
              </div>
              <div style={{ marginTop: '24px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setModalActive(false)}>Cancel</button>
                <button className="btn btn-primary" id="syllabus-modal-action-btn" disabled={buttonDisabled} onClick={handleFinish}>
                  Proceed Mapping &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
