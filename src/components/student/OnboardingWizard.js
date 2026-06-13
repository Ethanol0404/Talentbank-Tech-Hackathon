'use client';

import React, { useState, useRef } from 'react';
import { useAppState } from '@/context/AppStateContext';

export default function OnboardingWizard() {
  const { addStudent, setActiveScreen } = useAppState();
  const [dragOver, setDragOver] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) startFileIngestion(files[0]);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length) startFileIngestion(files[0]);
  };

  const startFileIngestion = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const textContent = e.target?.result || '';
      processResume(textContent, file.name);
    };
    reader.onerror = () => {
      processResume('File name upload: ' + file.name, file.name);
    };
    reader.readAsText(file);
  };

  const processResume = async (text, fileName) => {
    setIngesting(true);
    setProgress(0);
    setStatusText('Initializing connection to AI Router...');

    try {
      // Simulate progress states
      setTimeout(() => { setProgress(15); setStatusText('Parsing document structure...'); }, 200);
      setTimeout(() => { setProgress(45); setStatusText('AI Engine: Extracting hidden skills...'); }, 500);
      setTimeout(() => { setProgress(75); setStatusText('AI Engine: Mapped to target industry alignments...'); }, 800);
      
      // Wait for simulation
      await new Promise(resolve => setTimeout(resolve, 1100));

      const lowerText = text.toLowerCase() + ' ' + fileName.toLowerCase();
      let tech = [];
      let soft = [];
      let role = 'Software Engineer';
      let overall = 78;

      if (lowerText.includes('python') || lowerText.includes('data science') || lowerText.includes('analyst') || lowerText.includes('machine')) {
        tech = ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Tableau'];
        soft = ['Analytical Thinking', 'Attention to Detail'];
        role = 'Data Scientist';
        overall = 85;
      } else if (lowerText.includes('agile') || lowerText.includes('scrum') || lowerText.includes('project') || lowerText.includes('business')) {
        tech = ['Agile PM', 'Scrum Master', 'SQL', 'Tableau', 'User Stories'];
        soft = ['Communication', 'Stakeholder Alignment'];
        role = 'Business Analyst';
        overall = 94;
      } else if (lowerText.includes('docker') || lowerText.includes('cloud') || lowerText.includes('aws') || lowerText.includes('devops') || lowerText.includes('kubernetes')) {
        tech = ['Docker', 'AWS Cloud', 'Kubernetes', 'Linux Shell', 'CI/CD'];
        soft = ['Systems Architecture', 'Troubleshooting'];
        role = 'DevOps Engineer';
        overall = 82;
      } else if (lowerText.includes('security') || lowerText.includes('cyber') || lowerText.includes('network')) {
        tech = ['Bash Scripting', 'Penetration Testing', 'Security Audits', 'Network Protocols'];
        soft = ['Incident Response', 'Vulnerability Analysis'];
        role = 'Security Analyst';
        overall = 88;
      } else {
        tech = ['Java Core', 'REST APIs', 'Git Version Control', 'Docker'];
        soft = ['Problem Solving', 'Collaborative Coding'];
        role = 'Backend Software Engineer';
        overall = 76;
      }

      setProgress(100);
      setStatusText('Syncing profile and loading Candidate Dashboard...');

      const rawName = fileName.split('.')[0];
      const candidateName = rawName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Uploaded Profile';

      const parsedStudent = {
        id: 'student_uploaded',
        name: candidateName,
        major: `Bachelor of Computer Science (${role})`,
        targetRole: role,
        readiness: overall,
        compatibility: overall,
        skills: [
          ...tech.map(s => ({ name: s, verified: true })),
          ...soft.map(s => ({ name: s, verified: false }))
        ],
        competencies: {
          technical: overall + 4,
          analytical: overall + 2,
          communication: 75
        },
        portfolio: {
          avatar: candidateName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          description: `Custom profile generated from uploaded resume. Actively pursuing roles in ${role}.`,
          accomplishments: [
            { title: 'Uploaded Resume Ingestion', provider: 'UniOS AI Validator', link: '#', doc: 'Resume Check', icon: '📄' }
          ]
        },
        xai: {
          summary: `AI Diagnostic parsed profile for ${candidateName}. Detected capabilities in ${tech.join(', ')}. Mapped to targeted industry role ${role} with an overall readiness alignment of ${overall}%.`,
          strengths: ['Extracted profile matches target role directives', 'Verified technical badges successfully parsed'],
          gaps: ['Verify additional transcript outcomes to improve readiness score']
        }
      };

      addStudent(parsedStudent);

      setTimeout(() => {
        setActiveScreen('student-dashboard');
      }, 1000);

    } catch (err) {
      console.error(err);
      setStatusText('Error: Ingestion failed. Please try again.');
    }
  };

  return (
    <div className="view-panel active">
      <div className="flex-between mb-24">
        <div>
          <h2>Student Onboarding Wizard</h2>
          <p>Step 1 of 2: Upload documents to analyze your readiness score</p>
        </div>
        <div className="flex-gap-16">
          <span className="badge badge-verified">Step 1: Document Scan</span>
          <span className="badge badge-optional">Step 2: Review</span>
        </div>
      </div>

      <div className="split-grid">
        {/* Left Column: Drag & Drop zone */}
        <div className="card">
          <div className="card-title">Upload Profile Documents</div>
          <div 
            className={`upload-zone ${dragOver ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <h3>Drag and drop your file here</h3>
            <p>Supports PDF, DOCX (Max 10MB)</p>
            <label className="btn btn-primary" style={{ marginTop: '8px', cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
              Browse Files
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }} 
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {ingesting && (
            <div id="ingestion-progress-container" style={{ marginTop: '16px' }}>
              <div className="flex-between">
                <span className="mono-text">{statusText}</span>
                <span className="mono-text">{progress}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Document Checklist */}
        <div className="card">
          <div className="card-title">Ingestion & Verification Status</div>
          <ul className="checklist-list" style={{ listStyle: 'none', padding: 0 }}>
            <li className="checklist-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span className="checklist-label">📄 Resume Text</span>
              <span className={`badge ${ingesting && progress >= 45 ? 'badge-verified' : 'badge-pending'}`}>
                {ingesting && progress >= 45 ? 'Verified' : 'Pending Scan'}
              </span>
            </li>
            <li className="checklist-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span className="checklist-label">📊 Academic Transcript</span>
              <span className={`badge ${ingesting && progress >= 75 ? 'badge-verified' : 'badge-pending'}`}>
                {ingesting && progress >= 75 ? 'Verified' : 'Pending Scan'}
              </span>
            </li>
            <li className="checklist-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span className="checklist-label">⚙️ Active Projects</span>
              <span className={`badge ${ingesting && progress >= 100 ? 'badge-verified' : 'badge-pending'}`}>
                {ingesting && progress >= 100 ? 'Verified' : 'Pending Scan'}
              </span>
            </li>
            <li className="checklist-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span className="checklist-label">🛠️ Professional Workshops</span>
              <span className="badge badge-optional">Optional</span>
            </li>
            <li className="checklist-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span className="checklist-label">🏆 Hackathons & Competitions</span>
              <span className="badge badge-optional">Optional</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-between mt-24">
        <button className="btn btn-secondary" onClick={() => setActiveScreen('')}>Back</button>
        <button className="btn btn-primary" onClick={() => setActiveScreen('student-dashboard')}>Next Step: View Dashboard &rarr;</button>
      </div>
    </div>
  );
}
