'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppStateContext = createContext();

const initialMockStudents = [
  {
    id: "student_001",
    name: "Ahmad Faris",
    major: "Bachelor of Computer Science (Data Science)",
    targetRole: "Data Scientist",
    readiness: 79,
    compatibility: 79,
    skills: [
      { name: "Python", verified: true },
      { name: "Machine Learning", verified: true },
      { name: "AWS EC2", verified: true },
      { name: "SQL", verified: false },
      { name: "Apache Spark", verified: false }
    ],
    competencies: { technical: 88, analytical: 85, communication: 70 },
    portfolio: {
      avatar: "AF",
      description: "Data Science student with 3 completed ML projects and a solid foundation in Python & Cloud deployment.",
      accomplishments: [
        { title: "Student Grade Predictor", provider: "Universiti Teknologi Malaysia", link: "#", doc: "Project Spec", icon: "📊" },
        { title: "Sentiment Analysis API", provider: "TechCorp Malaysia", link: "#", doc: "Internship Review", icon: "🤖" },
        { title: "AWS Cloud Practitioner", provider: "Amazon Web Services", link: "#", doc: "AWS Credential", icon: "☁️" }
      ]
    },
    xai: {
      summary: "Ahmad demonstrates strong technical capability and above-average problem-solving aptitude, supported by hands-on experience in machine learning projects and competition placements. His overall readiness of 79 reflects a solid foundation, with the primary gap being limited industry-scale deployment experience and MLOps knowledge.",
      strengths: [
        "Proven machine learning engineering capability demonstrated through two independently deployed projects",
        "Competition performance (IEEE 2nd place, UTM Data Science Top 10) evidences strong analytical and problem-solving skills",
        "Leadership experience as Vice President and Technical Lead provides organisational and coordination competency",
        "AWS EC2 deployment experience demonstrates ability to move models from notebook to production environment"
      ],
      gaps: [
        "No evidence of MLOps practices (model monitoring, CI/CD for ML, experiment tracking) — a gap for industry Data Scientist roles",
        "Industry exposure limited to one 3-month internship — additional industry projects or a second internship would strengthen this dimension",
        "No evidence of big data processing experience (Spark, Hadoop) — important for large-scale data scientist positions",
        "Communication dimension would benefit from evidence of technical writing, blog posts, or external presentations"
      ]
    }
  },
  {
    id: "student_002",
    name: "Alice Tan",
    major: "Business Information Systems",
    targetRole: "Business Analyst",
    readiness: 94,
    compatibility: 94,
    skills: [
      { name: "SQL", verified: true },
      { name: "Data Visualization", verified: true },
      { name: "Agile PM", verified: true },
      { name: "Python", verified: false },
      { name: "Excel", verified: false }
    ],
    competencies: { technical: 100, analytical: 85, communication: 70 },
    portfolio: {
      avatar: "AT",
      description: "Business Analytics major focused on business-system alignment, agile database query optimizations, and dashboard design.",
      accomplishments: [
        { title: "AmanPay AI Project", provider: "Multimedia University", link: "#", doc: "Project Spec", icon: "💳" },
        { title: "Agile Database Optimize", provider: "AmanPay Internship", link: "#", doc: "Internship Review", icon: "⚡" },
        { title: "Scrum Master PSM I", provider: "Scrum.org", link: "#", doc: "Certification Check", icon: "🛡️" }
      ]
    },
    xai: {
      summary: "Alice exhibits near-perfect alignment with Business Analyst capabilities, spearheaded by verified Scrum Master certification and high-level SQL query experience during the AmanPay AI Project. Gaps are negligible, mainly focused on advanced python programming automation.",
      strengths: [
        "Excellent data visualization skills (verified Tableau proficiency)",
        "Certified Scrum Master credentials proving agile process alignment",
        "Proven SQL database architecture experience during AmanPay implementation"
      ],
      gaps: [
        "Limited advanced python modeling experience",
        "Could benefit from additional cloud database hosting exposure"
      ]
    }
  },
  {
    id: "student_003",
    name: "Priya Nair",
    major: "Bachelor of Software Engineering",
    targetRole: "Backend Software Engineer",
    readiness: 82,
    compatibility: 82,
    skills: [
      { name: "Java", verified: true },
      { name: "Docker", verified: true },
      { name: "FastAPI", verified: true },
      { name: "SQL", verified: false }
    ],
    competencies: { technical: 90, analytical: 80, communication: 75 },
    portfolio: {
      avatar: "PN",
      description: "Software engineer candidate with key backend experience in java microservices and docker container orchestration.",
      accomplishments: [
        { title: "Microservices API Design", provider: "Multimedia University", link: "#", doc: "Project Github", icon: "🌐" },
        { title: "Docker Container Deploy", provider: "MMU Code Labs", link: "#", doc: "Lab Validation", icon: "🐳" }
      ]
    },
    xai: {
      summary: "Priya presents a solid software engineering background with verified Java programming capabilities. The main gap is overall lack of production cloud orchestration exposure (Kubernetes/AWS Specialty).",
      strengths: [
        "Strong Java coding foundation with certified Oracle SE 8 programmer status",
        "Practical Docker experience in containerized backend endpoints"
      ],
      gaps: [
        "No Kubernetes clusters management history detected",
        "Needs more exposure to cloud serverless hosting"
      ]
    }
  },
  {
    id: "student_004",
    name: "Lim Wei Jie",
    major: "Bachelor of Information Technology (Cybersecurity)",
    targetRole: "Security Analyst",
    readiness: 88,
    compatibility: 88,
    skills: [
      { name: "Python", verified: true },
      { name: "Bash Scripting", verified: true },
      { name: "Network Scanning", verified: true },
      { name: "CEH", verified: false }
    ],
    competencies: { technical: 95, analytical: 88, communication: 80 },
    portfolio: {
      avatar: "WJ",
      description: "IT Security specialist with deep capture-the-flag competition experience and penetration testing background.",
      accomplishments: [
        { title: "APU Network Scanner", provider: "Asia Pacific University", link: "#", doc: "Tool Repo", icon: "🔍" },
        { title: "Capture The Flag First Place", provider: "APU CTF 2024", link: "#", doc: "Rank Certificate", icon: "🏆" }
      ]
    },
    xai: {
      summary: "Lim demonstrates exceptional security profiling skills, as validated by first-place CTF awards and a custom-built network scanning tool. Minor gaps exist in commercial cloud-security architecture logs analysis.",
      strengths: [
        "Strong penetration testing and Bash automation scripts background",
        "Verified competitive CTF record showing analytical speed"
      ],
      gaps: [
        "No corporate security audit logs exposure",
        "CEH certification remains in-progress"
      ]
    }
  }
];

export function AppStateProvider({ children }) {
  const [activePersona, setActivePersona] = useState('');
  const [activeScreen, setActiveScreen] = useState('');
  const [students, setStudents] = useState(initialMockStudents);
  const [shortlist, setShortlist] = useState([]);
  const [filterSkills, setFilterSkills] = useState(['SQL', 'Python']);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedEvalCandidate, setSelectedEvalCandidate] = useState(initialMockStudents[1]); // Default to Alice Tan
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    // Check connection to local python serverless API
    fetch('http://localhost:8000/api')
      .then(res => res.json())
      .then(data => setApiConnected(data.status === 'healthy'))
      .catch(() => setApiConnected(false));
  }, []);

  const enterPersona = (persona) => {
    setActivePersona(persona);
    if (persona === 'student') {
      setActiveScreen('student-onboarding');
    } else if (persona === 'university') {
      setActiveScreen('university-intake');
    } else if (persona === 'employer') {
      setActiveScreen('employer-search');
    } else {
      setActiveScreen('');
    }
  };

  const toggleShortlist = (studentId) => {
    setShortlist((prev) => {
      const isShort = prev.some(s => s.id === studentId);
      if (isShort) {
        return prev.filter(s => s.id !== studentId);
      } else {
        const student = students.find(s => s.id === studentId);
        return [...prev, student];
      }
    });
  };

  const addStudent = (student) => {
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === student.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = student;
        return updated;
      }
      return [student, ...prev];
    });
    // Set active student
    setSelectedEvalCandidate(student);
  };

  return (
    <AppStateContext.Provider value={{
      activePersona,
      setActivePersona,
      activeScreen,
      setActiveScreen,
      students,
      setStudents,
      shortlist,
      setShortlist,
      filterSkills,
      setFilterSkills,
      verifiedOnly,
      setVerifiedOnly,
      selectedEvalCandidate,
      setSelectedEvalCandidate,
      apiConnected,
      enterPersona,
      toggleShortlist,
      addStudent
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
