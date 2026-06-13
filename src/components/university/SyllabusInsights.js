'use client';

import React, { useState, useEffect } from 'react';

const mockCourseDescriptions = {
  "SEC-3013": `Structured SQL Database Querying: This module introduces students to advanced query optimization, B-Tree indexing, index tuning, composite query logic, and PostgreSQL query execution plans.
Learning Outcomes:
1. Formulate complex SELECT statements with multiple aggregates and subqueries.
2. Implement schema indexing to optimize read queries by over 30%.`,
  "SEC-3022": `Agile Project Management Systems: Students learn Agile scrum methodologies, sprint planning, backlog refinement, user story writing, and work alignment metrics.
Learning Outcomes:
1. Coordinate sprint retrospectives and backlogs.
2. Align project deliverables with business stakeholder maps.`,
  "SEC-4001": `Cloud Labs & Infrastructure Design: Technical lab focuses on containerizing applications, Docker configurations, AWS EC2 deploy systems, security groups, and CI/CD pipelines.
Learning Outcomes:
1. Deploy containers on local clusters.
2. Automate deploy pipelines using Git runners.`,
  "custom": ""
};

export default function SyllabusInsights() {
  const [course, setCourse] = useState('SEC-3013');
  const [syllabusText, setSyllabusText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [results, setResults] = useState({ roles: [], tech: [], soft: [] });

  useEffect(() => {
    setSyllabusText(mockCourseDescriptions[course] || '');
    setAnalyzed(false);
  }, [course]);

  const handleAnalyze = () => {
    setLoading(true);
    setAnalyzed(false);

    setTimeout(() => {
      let roles = [];
      let tech = [];
      let soft = [];

      if (course === 'SEC-3013') {
        roles = ['Database Administrator', 'Data Analyst', 'SQL Developer'];
        tech = ['PostgreSQL', 'Query Optimization', 'Index Tuning', 'B-Tree Schema'];
        soft = ['Logical Thinking', 'Performance Audit', 'Detail-Oriented'];
      } else if (course === 'SEC-3022') {
        roles = ['Scrum Master', 'Product Owner', 'Project Manager'];
        tech = ['Agile Framework', 'Jira Systems', 'Sprint Backlog', 'Kanban Board'];
        soft = ['Sprint Coordination', 'Stakeholder Communication', 'Team Leadership'];
      } else if (course === 'SEC-4001') {
        roles = ['DevOps Engineer', 'Cloud Architect', 'Systems Engineer'];
        tech = ['Docker Containers', 'AWS EC2', 'CI/CD Pipelines', 'Security Groups'];
        soft = ['Systems Architecture', 'Troubleshooting', 'Automation Planning'];
      } else {
        roles = ['Fullstack Developer', 'SaaS Analyst'];
        tech = ['REST API Design', 'Git Version Control', 'Syllabus Extracted Core'];
        soft = ['Analytical Troubleshooting', 'Collaborative Scoping'];
      }

      setResults({ roles, tech, soft });
      setLoading(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="view-panel active">
      <div className="mb-24">
        <h2>Curriculum Insights & Market Mapping</h2>
        <p>Extract employability skills and map career outcomes directly from your course syllabus utilizing the Core AI Engine.</p>
      </div>

      <div className="split-grid">
        {/* Left Column: Input */}
        <div className="card">
          <div className="card-title">Syllabus Analysis Interface</div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <label className="data-label">Select Course Module</label>
            <select className="form-input" value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="SEC-3013">SEC-3013: Structured SQL Database Querying</option>
              <option value="SEC-3022">SEC-3022: Agile Project Management Systems</option>
              <option value="SEC-4001">SEC-4001: Cloud Labs & Infrastructure Design</option>
              <option value="custom">Custom Course Syllabus...</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <label className="data-label">Course Description & Learning Outcomes</label>
            <textarea 
              className="form-input" 
              rows="10" 
              value={syllabusText} 
              onChange={(e) => setSyllabusText(e.target.value)}
              placeholder="Paste your course syllabus details, topics, and CLOs here..."
            />
          </div>
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleAnalyze}>Analyze Syllabus &rarr;</button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="card">
          <div className="card-title">AI Alignment Mappings</div>
          {loading && (
            <div id="insights-loading-state" style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="status-dot" style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent-teal)' }}></div>
              <p style={{ marginTop: '12px' }}>AI Parsing Syllabus & Mapping to Employer Market Demands...</p>
            </div>
          )}
          
          {!loading && !analyzed && (
            <div id="insights-output-placeholder" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Select a course syllabus or input custom description, then click 'Analyze Syllabus' to see extracted alignments.
            </div>
          )}

          {!loading && analyzed && (
            <div id="insights-output-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Mapped Career Pathways</label>
                <div className="candidate-skills-wrap" style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {results.roles.map((r, i) => (
                    <span key={i} className="badge badge-verified">{r}</span>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Extracted Technical Competencies</label>
                <div className="candidate-skills-wrap" style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {results.tech.map((t, i) => (
                    <span key={i} className="badge badge-optional">{t} 🛡️</span>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Extracted Professional Soft Skills</label>
                <div className="candidate-skills-wrap" style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {results.soft.map((s, i) => (
                    <span key={i} className="badge badge-pending">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
