'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '@/context/AppStateContext';

export default function ShortlistPipeline() {
  const { shortlist, toggleShortlist, setActiveScreen } = useAppState();
  
  const [modalActive, setModalActive] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openInterview = (candidate) => {
    setActiveCandidate(candidate);
    setMessages([
      {
        sender: `${candidate.name} (AI Candidate)`,
        text: `Hello! I am the AI persona of ${candidate.name}. Thank you for initiating this fit evaluation. Feel free to ask me anything about my background, skills, or portfolio!`,
        isAi: true
      }
    ]);
    setModalActive(true);
  };

  const handleSendMessage = () => {
    if (!inputVal.trim() || !activeCandidate) return;
    const text = inputVal.trim();
    
    // User message
    const userMsg = { sender: 'You (Recruiter)', text, isAi: false };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    const name = activeCandidate.name;

    // AI reply after 800ms
    setTimeout(() => {
      let responseText = `Thank you for the question! In my portfolio, I've demonstrated strong competencies that align with this role. I would be glad to discuss my background further or complete any technical tasks you have in mind.`;
      
      const lowerText = text.toLowerCase();
      if (name.includes("Ahmad")) {
        if (lowerText.includes("python") || lowerText.includes("ml") || lowerText.includes("machine") || lowerText.includes("model")) {
          responseText = `I have extensive experience with Python and Machine Learning. For example, on my Student Grade Predictor project, I built and deployed a regression model. I've also worked with Sentiment Analysis APIs.`;
        } else if (lowerText.includes("database") || lowerText.includes("sql") || lowerText.includes("index")) {
          responseText = `While SQL was marked as a gap in my initial profile, I have foundational knowledge in database queries and have since optimized database operations for my academic grades projects.`;
        } else if (lowerText.includes("cloud") || lowerText.includes("aws")) {
          responseText = `I'm AWS Certified (Cloud Practitioner) and have hands-on experience deploying microservices and ML models on AWS EC2 instances.`;
        }
      } else if (name.includes("Alice")) {
        if (lowerText.includes("sql") || lowerText.includes("database") || lowerText.includes("optimize") || lowerText.includes("query")) {
          responseText = `During my AmanPay internship, I optimized complex SQL queries and database schemas, which significantly improved page load times and transaction speeds.`;
        } else if (lowerText.includes("agile") || lowerText.includes("scrum") || lowerText.includes("pm")) {
          responseText = `I'm a certified Professional Scrum Master (PSM I). I led scrum ceremonies and aligned stakeholders during my AmanPay AI project.`;
        } else if (lowerText.includes("viz") || lowerText.includes("tableau") || lowerText.includes("chart") || lowerText.includes("dashboard")) {
          responseText = `I specialize in data visualization. I built the client churn dashboards in Tableau for executive reporting at AmanPay, focusing on summary KPIs and interactive filters.`;
        }
      } else if (name.includes("Priya")) {
        if (lowerText.includes("java") || lowerText.includes("microservice") || lowerText.includes("backend")) {
          responseText = `I specialize in Java and microservices design. I built containerized REST APIs using Docker and FastAPI for our university labs.`;
        } else if (lowerText.includes("docker") || lowerText.includes("container")) {
          responseText = `I have containerized microservice architectures using Docker and validated deployments on MMU local server clusters.`;
        }
      } else if (name.includes("Lim") || name.includes("Wei")) {
        if (lowerText.includes("security") || lowerText.includes("penetration") || lowerText.includes("network") || lowerText.includes("scan")) {
          responseText = `I built a custom network scanner at APU and won 1st place in the capture-the-flag (CTF) competition, demonstrating practical cybersecurity capabilities.`;
        } else if (lowerText.includes("python") || lowerText.includes("bash") || lowerText.includes("script")) {
          responseText = `I use Python and Bash scripting to automate security auditing tasks, scan ports, and compile vulnerability reports.`;
        }
      }

      setMessages(prev => [...prev, {
        sender: `${name} (AI Candidate)`,
        text: responseText,
        isAi: true
      }]);
    }, 800);
  };

  const handleExport = () => {
    if (shortlist.length === 0) {
      alert("Shortlist is empty! Nothing to export.");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Candidate Name,Major,Compatibility Match,Verified Skills\n";
    
    shortlist.forEach(student => {
      const skillsList = student.skills.map(s => `${s.name}${s.verified ? ' (Verified)' : ''}`).join(" | ");
      csvContent += `"${student.name}","${student.major}","${student.compatibility}%","${skillsList}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "UniOS_Shortlisted_Candidates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-panel active">
      <div className="flex-between mb-24">
        <div>
          <h2>Shortlisted Candidates Pipeline</h2>
          <p>Manage and evaluate candidates selected for deeper interview stages</p>
        </div>
        <div className="flex-gap-16">
          <button className="btn btn-secondary" onClick={handleExport}>📥 Export Shortlist</button>
          <button className="btn btn-primary" onClick={() => setActiveScreen('employer-search')}>
            Back to Search Directory
          </button>
        </div>
      </div>

      {/* Top Pipeline Metrics Bar */}
      <div className="card mb-24" style={{ padding: '16px 24px', borderRadius: '8px' }}>
        <div className="flex-between">
          <div className="flex-gap-16">
            <span>Total Shortlisted: <strong>{shortlist.length}</strong></span>
            <span>•</span>
            <span>Top Alignments: <strong style={{ color: 'var(--state-verified)' }}>FinTech Major</strong></span>
          </div>
          <span className="verified-text" style={{ color: 'var(--state-verified)' }}>🛡️ All Skills Verified</span>
        </div>
      </div>

      {/* Shortlisted Candidates list container */}
      <div className="candidate-card-list" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {shortlist.length > 0 ? (
          shortlist.map((student) => (
            <div key={student.id} className="card" style={{ padding: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="candidate-avatar-placeholder" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {student.portfolio.avatar}
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{student.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.major}</span>
                  </div>
                </div>
                <span className="candidate-match-score" style={{ fontWeight: 700, color: 'var(--state-verified)' }}>
                  {student.compatibility}% Match
                </span>
              </div>
              <div className="candidate-skills-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {student.skills.map((s, idx) => (
                  <span key={idx} className={`badge ${s.verified ? 'badge-verified' : 'badge-optional'}`}>
                    {s.name} {s.verified ? '🛡️' : ''}
                  </span>
                ))}
              </div>
              <div className="candidate-card-footer" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-primary active" 
                  style={{ backgroundColor: 'var(--state-pending)', border: 'none', padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => toggleShortlist(student.id)}
                >
                  ★ Shortlisted
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => openInterview(student)}
                >
                  Evaluate Fit & Run Interview Simulation
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '30px 0' }}>
            No candidates shortlisted yet. Add candidates from the Search Directory.
          </p>
        )}
      </div>

      {/* Recruiter-Candidate Live Interview Simulation Modal */}
      {modalActive && activeCandidate && (
        <div className="modal-overlay active" id="interview-modal">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>Live Fit Evaluation & Interview Simulation</h3>
              <button className="modal-close" onClick={() => setModalActive(false)}>&times;</button>
            </div>
            
            <div className="chat-history" id="interview-chat-history">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={msg.isAi ? 'chat-bubble-ai' : 'chat-bubble-user'}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex-gap-16">
              <input 
                type="text" 
                className="form-input" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your response here..." 
                style={{ flexGrow: 1 }}
              />
              <button className="btn btn-primary" onClick={handleSendMessage} style={{ padding: '10px 16px' }}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
