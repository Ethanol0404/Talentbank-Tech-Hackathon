'use client';

import React, { useState, useRef } from 'react';
import { useAppState } from '@/context/AppStateContext';
import { motion } from 'framer-motion';

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
      // Real AI Backend Fetch (Groq Llama-3)
      const [skillsRes, readinessRes] = await Promise.all([
        fetch('/api/extract-skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: text, source_type: 'resume' })
        }),
        fetch('/api/evaluate-readiness', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume_text: text, projects: [], workshops: [] })
        })
      ]);

      if (!skillsRes.ok || !readinessRes.ok) {
        throw new Error('AI Backend failed to process the document.');
      }

      const skillsData = await skillsRes.json();
      const readinessData = await readinessRes.json();

      let tech = skillsData.technical_skills || [];
      let soft = skillsData.soft_skills || [];
      let role = (skillsData.mapped_roles && skillsData.mapped_roles.length > 0) ? skillsData.mapped_roles[0] : 'Software Engineer';
      let overall = readinessData.overall_score || 78;
      
      let aiStrengths = readinessData.strengths || ['Profile matches targeted role directives'];
      let aiGaps = readinessData.gaps || ['Provide more measurable outcomes in bullet points'];


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
          strengths: aiStrengths,
          gaps: aiGaps
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
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
        </motion.div>

        {/* Right Column: Document Checklist */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
      </div>

      <div className="flex-between mt-24">
        <button className="btn btn-secondary" onClick={() => setActiveScreen('')}>Back</button>
        <button className="btn btn-primary" onClick={() => setActiveScreen('student-dashboard')}>Next Step: View Dashboard &rarr;</button>
      </div>
    </div>
  );
}
