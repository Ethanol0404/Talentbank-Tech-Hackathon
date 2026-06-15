'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/AppStateContext';

export default function TalentSearch() {
  const { 
    students, 
    shortlist, 
    filterSkills, 
    setFilterSkills, 
    verifiedOnly, 
    setVerifiedOnly, 
    setSelectedEvalCandidate, 
    setActiveScreen 
  } = useAppState();

  const [skillInput, setSkillInput] = useState('');
  const [majorFilter, setMajorFilter] = useState('');

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim();
      if (!filterSkills.includes(val)) {
        setFilterSkills([...filterSkills, val]);
      }
      setSkillInput('');
    }
  };

  const removeSkillPill = (skill) => {
    setFilterSkills(filterSkills.filter(s => s !== skill));
  };

  // Filter logic
  const filteredCandidates = students.filter(student => {
    // Major filter
    if (majorFilter && !student.major.toLowerCase().includes(majorFilter.toLowerCase())) {
      return false;
    }
    // Verified only filter
    if (verifiedOnly) {
      const hasVerified = student.skills.some(s => s.verified);
      if (!hasVerified) return false;
    }
    // Skills filter (intersection match)
    if (filterSkills.length > 0) {
      const studentSkillNames = student.skills.map(s => s.name.toLowerCase());
      const matchesAnySkill = filterSkills.some(fs => studentSkillNames.includes(fs.toLowerCase()));
      if (!matchesAnySkill) return false;
    }
    return true;
  });

  const handleSelect = (candidate) => {
    setSelectedEvalCandidate(candidate);
    setActiveScreen('employer-candidate');
  };

  return (
    <div className="view-panel active">
      <div className="flex-between mb-24">
        <div>
          <h2>Target Talent Search Directory</h2>
          <p>Advanced talent query parser and matching algorithms</p>
        </div>
        <div className="flex-gap-16">
          <button className="btn btn-primary active">Search Candidates</button>
          <button className="btn btn-secondary" onClick={() => setActiveScreen('employer-shortlist')}>
            Shortlist ({shortlist.length})
          </button>
        </div>
      </div>

      <div className="split-grid" style={{ gridTemplateColumns: '320px 1fr' }}>
        {/* Left Column: Filter Engine */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-title">Filter Engine</div>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Target Skills</label>
            <div className="tag-pills-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px 14px', minHeight: '46px', backgroundColor: 'var(--bg-card)' }}>
              {filterSkills.map((skill, idx) => (
                <span key={idx} className="tag-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 600, padding: '3px 10px', borderRadius: '8px' }}>
                  {skill}
                  <button onClick={() => removeSkillPill(skill)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              className="form-input" 
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type skill and press Enter (e.g. SQL, Python)" 
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <label className="data-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Major Selector</label>
            <select 
              className="form-input" 
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
            >
              <option value="">All Majors</option>
              <option value="Business Information Systems">Business Information Systems</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
          </div>

          <div className="form-group" style={{ marginTop: '24px' }}>
            <div className="toggle-switch-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '10px', backgroundColor: 'var(--bg-card)' }}>
              <label htmlFor="verified-only-checkbox" style={{ cursor: 'pointer', flexGrow: 1 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Verified Skills Only</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Only show badges verified by faculty</p>
              </label>
              <label className="toggle-switch-wrapper" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  id="verified-only-checkbox" 
                  className="toggle-input" 
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span className="toggle-switch" style={{ display: 'inline-block', width: '48px', height: '24px', backgroundColor: verifiedOnly ? 'var(--state-verified)' : '#CBD5E1', borderRadius: '12px', position: 'relative', transition: 'background-color 0.2s ease' }}>
                  <span style={{ content: '""', position: 'absolute', top: '2px', left: '2px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'transform 0.2s ease', transform: verifiedOnly ? 'translateX(24px)' : 'none' }}></span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Candidate List */}
        <div className="card">
          <div className="card-title">Matching Candidates Found</div>
          <div className="candidate-card-list" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="candidate-card" 
                  style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '20px', border: '1px solid var(--border-light)', borderRadius: '16px', cursor: 'pointer' }}
                  onClick={() => handleSelect(candidate)}
                >
                  <div className="candidate-avatar-placeholder" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-gradient)', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                    {candidate.portfolio.avatar}
                  </div>
                  <div className="candidate-card-body" style={{ flexGrow: 1 }}>
                    <div className="candidate-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div className="candidate-name-section">
                        <h4 style={{ margin: 0 }}>{candidate.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{candidate.major}</span>
                      </div>
                      <span className="candidate-match-score" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--state-verified)' }}>{candidate.compatibility}% Match</span>
                    </div>
                    <div className="candidate-skills-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {candidate.skills.slice(0, 4).map((s, idx) => (
                        <span key={idx} className={`badge ${s.verified ? 'badge-verified' : 'badge-optional'}`}>
                          {s.name} {s.verified ? '🛡️' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                No candidates match the specified filter parameters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
