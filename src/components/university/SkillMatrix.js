'use client';

import React, { useState } from 'react';

const mockCurriculumMatrix = {
  courses: [
    { code: "SEC-3013", name: "Structured SQL Database Querying", skills: { "Python Core": "level-medium", "FinTech Analytics": "level-gap", "Cloud Engine": "level-low", "Agile PM": "level-medium" } },
    { code: "SEC-3022", name: "Agile Project Management Systems", skills: { "Python Core": "level-gap", "FinTech Analytics": "level-low", "Cloud Engine": "level-gap", "Agile PM": "level-high" } },
    { code: "SEC-4001", name: "Cloud Labs & Infrastructure Design", skills: { "Python Core": "level-medium", "FinTech Analytics": "level-medium", "Cloud Engine": "level-high", "Agile PM": "level-gap" } },
    { code: "SEC-4012", name: "Financial Technology Capstone Project", skills: { "Python Core": "level-high", "FinTech Analytics": "level-high", "Cloud Engine": "level-medium", "Agile PM": "level-high" } }
  ],
  skills: ["Python Core", "FinTech Analytics", "Cloud Engine", "Agile PM"]
};

export default function SkillMatrix() {
  const [modalActive, setModalActive] = useState(false);
  const [modalData, setModalData] = useState({ courseCode: '', skill: '', level: '', clos: [] });

  const inspectCell = (courseCode, skill, level) => {
    const mockClos = {
      "level-high": [
        "CLO 1: Explain and apply the standard algorithms under various database settings.",
        "CLO 2: Optimize composite join querying matrices achieving 30%+ indexing improvements."
      ],
      "level-medium": [
        "CLO 3: Synthesize database entities into visual graphs.",
        "CLO 4: Formulate basic aggregation metrics."
      ],
      "level-low": [
        "CLO 5: Review external data catalogs and references."
      ],
      "level-gap": [
        "No direct Course Learning Outcomes detected in syllabus matching this skill cluster."
      ]
    };

    setModalData({
      courseCode,
      skill,
      level,
      clos: mockClos[level] || []
    });
    setModalActive(true);
  };

  return (
    <div className="view-panel active">
      <div className="mb-24">
        <h2>Interactive Skill Mapping Heatmap Matrix</h2>
        <p>Spreadsheet heatmap mapping active course curriculum coverage against market industry skill clusters. Cells are clickable to view matching syllabus documentation.</p>
      </div>

      <div className="card">
        <div className="matrix-container">
          <table className="matrix-table" id="heatmap-matrix-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px', textAlign: 'left' }}>Course Code / Title</th>
                {mockCurriculumMatrix.skills.map((skill, idx) => (
                  <th key={idx} style={{ padding: '14px', textAlign: 'center' }}>{skill}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockCurriculumMatrix.courses.map((course, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, padding: '14px', textAlign: 'left', backgroundColor: '#F8FAFC' }}>
                    {course.code} - {course.name}
                  </td>
                  {mockCurriculumMatrix.skills.map((skill, sIdx) => {
                    const level = course.skills[skill] || "level-gap";
                    const cellText = level === "level-high" ? "High" : level === "level-medium" ? "Med" : level === "level-low" ? "Low" : "Gap";
                    return (
                      <td 
                        key={sIdx} 
                        className={`heatmap-cell ${level}`} 
                        onClick={() => inspectCell(course.code, skill, level)}
                        style={{ padding: '14px', textAlign: 'center', cursor: 'pointer', fontWeight: 600 }}
                      >
                        {cellText}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex-between mt-24" style={{ fontSize: '0.85rem', color: 'var(--secondary-slate)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span><strong>Legend:</strong></span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '16px', height: '16px', backgroundColor: 'rgba(37,99,235,0.85)', borderRadius: '3px' }}></span> Solid Alignment (High)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '16px', height: '16px', backgroundColor: 'rgba(37,99,235,0.4)', borderRadius: '3px' }}></span> Medium Coverage
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '16px', height: '16px', backgroundColor: 'rgba(37,99,235,0.15)', borderRadius: '3px' }}></span> Light Exposure
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '16px', height: '16px', backgroundColor: '#F1F5F9', borderRadius: '3px', border: '1px solid var(--border-light)' }}></span> Skill Gap / Empty
            </span>
          </div>
          <span>💡 Click cells to inspect aligned curriculum learning outcomes</span>
        </div>
      </div>

      {/* Heatmap Cell Inspection Modal */}
      {modalActive && (
        <div className="modal-overlay active" id="heatmap-inspect-modal">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 id="inspect-modal-title">Matrix Cell: {modalData.courseCode} ({modalData.skill})</h3>
              <button className="modal-close" onClick={() => setModalActive(false)}>&times;</button>
            </div>
            <div>
              <p id="inspect-modal-alignment-desc">
                Coverage strength: <strong style={{ color: 'var(--accent-blue)', textTransform: 'uppercase' }}>{modalData.level.replace("level-", "")}</strong>
              </p>
              <h4 className="mb-12">Aligned Syllabus CLOs:</h4>
              <ul id="inspect-modal-clo-list" style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                {modalData.clos.map((clo, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{clo}</li>
                ))}
              </ul>
              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={() => setModalActive(false)}>Close Inspector</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
