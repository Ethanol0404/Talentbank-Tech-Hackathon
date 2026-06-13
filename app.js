// app.js
// UniOS Frontend Logic and Data Router

// ==============================================
// Mock Data (Fallbacks for API connections)
// ==============================================

const mockStudents = [
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

const mockCurriculumMatrix = {
  courses: [
    { code: "SEC-3013", name: "Structured SQL Database Querying", skills: { "Python Core": "level-medium", "FinTech Analytics": "level-gap", "Cloud Engine": "level-low", "Agile PM": "level-medium" } },
    { code: "SEC-3022", name: "Agile Project Management Systems", skills: { "Python Core": "level-gap", "FinTech Analytics": "level-low", "Cloud Engine": "level-gap", "Agile PM": "level-high" } },
    { code: "SEC-4001", name: "Cloud Labs & Infrastructure Design", skills: { "Python Core": "level-medium", "FinTech Analytics": "level-medium", "Cloud Engine": "level-high", "Agile PM": "level-gap" } },
    { code: "SEC-4012", name: "Financial Technology Capstone Project", skills: { "Python Core": "level-high", "FinTech Analytics": "level-high", "Cloud Engine": "level-medium", "Agile PM": "level-high" } }
  ],
  skills: ["Python Core", "FinTech Analytics", "Cloud Engine", "Agile PM"]
};

// ==============================================
// State Variables
// ==============================================
let activePersona = "";
let activeScreen = "";
let shortlist = [];
let filterSkills = ["SQL", "Python"];
let verifiedOnly = false;
let selectedEvalCandidate = mockStudents[1]; // Alice Tan by default
let cohortChart = null;

// ==============================================
// API Client Configurations
// ==============================================
const API_BASE_URL = "http://localhost:8000/api";

async function checkApiConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    const data = await response.json();
    return data.status === "healthy";
  } catch (e) {
    return false;
  }
}

// ==============================================
// Initialization
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  loadUserTheme();
  initLanding();
  setupGlobalListeners();
  setupOnboardingDragDrop();
  setupEmployerFilters();
  setupStarRatings();
});

function initLanding() {
  document.getElementById("landing-page").style.display = "block";
  document.getElementById("global-header").style.display = "none";
  document.getElementById("app-shell").style.display = "none";
}

function enterPersona(persona) {
  activePersona = persona;
  document.getElementById("landing-page").style.display = "none";
  document.getElementById("global-header").style.display = "flex";
  document.getElementById("app-shell").style.display = "grid";
  
  // Set persona switcher buttons state
  document.querySelectorAll(".persona-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`persona-btn-${persona}`).classList.add("active");

  // Load appropriate sidebar menu and default screen
  renderSidebarMenu();
  
  if (persona === "student") {
    showScreen("student-onboarding");
  } else if (persona === "university") {
    showScreen("university-intake");
  } else if (persona === "employer") {
    showScreen("employer-search");
  }
}

function switchPersona(persona) {
  enterPersona(persona);
}

function exitToLanding() {
  activePersona = "";
  activeScreen = "";
  initLanding();
}

function setupGlobalListeners() {
  // Sidebar expand/collapse toggle button
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const shell = document.getElementById("app-shell");
  toggleBtn.addEventListener("click", () => {
    shell.classList.toggle("collapsed");
  });
}

// ==============================================
// Router & Sidebar Renderer
// ==============================================
function renderSidebarMenu() {
  const menuList = document.getElementById("sidebar-menu-list");
  menuList.innerHTML = "";

  const menuConfig = {
    student: [
      { id: "student-onboarding", label: "Onboarding Wizard", icon: '<svg viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
      { id: "student-dashboard", label: "Candidate Dashboard", icon: '<svg viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/></svg>' },
      { id: "student-discovery", label: "Discovery Hub", icon: '<svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
      { id: "student-portfolio", label: "Living Portfolio", icon: '<svg viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
      { id: "student-booster", label: "AI Resume Booster", icon: '<svg viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>' }
    ],
    university: [
      { id: "university-intake", label: "Course Intake", icon: '<svg viewBox="0 0 24 24"><path d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>' },
      { id: "university-matrix", label: "Skill Mapping Matrix", icon: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>' },
      { id: "university-insights", label: "Curriculum Insights", icon: '<svg viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>' },
      { id: "university-analytics", label: "Cohort Analytics", icon: '<svg viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>' }
    ],
    employer: [
      { id: "employer-search", label: "Search Directory", icon: '<svg viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>' },
      { id: "employer-candidate", label: "Deep Evaluation", icon: '<svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>' },
      { id: "employer-shortlist", label: "Shortlist Pipeline", icon: '<svg viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>' }
    ]
  };

  const listItems = menuConfig[activePersona] || [];
  
  // Set User Initial & Name in Navbar Profile Badge
  const avatarText = activePersona === "student" ? "AF" : activePersona === "university" ? "L" : "R";
  const profileName = activePersona === "student" ? "Ahmad Faris" : activePersona === "university" ? "Lecturer Account" : "Recruiter Portal";
  document.getElementById("user-avatar-initial").innerText = avatarText;
  document.getElementById("user-display-name").innerText = profileName;

  listItems.forEach(item => {
    const li = document.createElement("li");
    li.id = `sidebar-li-${item.id}`;
    li.innerHTML = `
      <a href="#" onclick="showScreen('${item.id}'); return false;">
        ${item.icon}
        <span>${item.label}</span>
      </a>
    `;
    menuList.appendChild(li);
  });
}

function showScreen(screenId) {
  activeScreen = screenId;
  
  // Update sidebar active selection
  document.querySelectorAll(".sidebar-menu li").forEach(li => li.classList.remove("active"));
  const activeLi = document.getElementById(`sidebar-li-${screenId}`);
  if (activeLi) activeLi.classList.add("active");

  // Switch View Panels
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.remove("active"));
  
  const targetPanel = document.getElementById(`view-${screenId}`);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }

  // Trigger screen-specific drawing / data loading
  if (screenId === "student-dashboard") {
    renderStudentDashboard();
  } else if (screenId === "student-discovery") {
    renderDiscoveryHub();
  } else if (screenId === "student-portfolio") {
    renderLivingPortfolio();
  } else if (screenId === "university-intake") {
    renderIntakeTable();
  } else if (screenId === "university-matrix") {
    renderHeatmapMatrix();
  } else if (screenId === "university-analytics") {
    renderCohortAttainmentChart();
    renderCurriculumImprovements();
  } else if (screenId === "university-insights") {
    populateSyllabusTemplate();
  } else if (screenId === "employer-search") {
    renderCandidatesSearch();
  } else if (screenId === "employer-candidate") {
    renderDeepEvaluation();
  } else if (screenId === "employer-shortlist") {
    renderShortlistPipeline();
  }
}

// ==============================================
// Screen 1: Student Onboarding Ingestion
// ==============================================
function setupOnboardingDragDrop() {
  const dropZone = document.getElementById("drag-drop-zone");
  const fileInput = document.getElementById("file-input-element");

  ["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    }, false);
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
    }, false);
  });

  dropZone.addEventListener("drop", handleDrop, false);
  fileInput.addEventListener("change", handleFileSelect, false);
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length) startFileIngestion(files[0]);
}

function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length) startFileIngestion(files[0]);
}

function startFileIngestion(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const textContent = e.target.result || "";
    processUploadedResume(textContent, file.name);
  };
  reader.onerror = function() {
    processUploadedResume("File name upload: " + file.name, file.name);
  };
  reader.readAsText(file);
}

async function processUploadedResume(text, fileName) {
  const progressContainer = document.getElementById("ingestion-progress-container");
  const progressBar = document.getElementById("ingestion-progress-bar");
  const percentageLabel = document.getElementById("ingestion-percentage");
  const statusLabel = document.getElementById("ingestion-status-text");

  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  percentageLabel.innerText = "0%";
  statusLabel.innerText = "Initializing connection to AI Router...";

  try {
    const isConnected = await checkApiConnection();
    let extractedSkills = null;
    let readinessScore = null;
    let recommendations = null;
    let explainability = null;

    // Simulate progress while calling backend
    progressBar.style.width = "15%";
    percentageLabel.innerText = "15%";
    statusLabel.innerText = "Parsing document structure...";

    if (isConnected) {
      // Step 1: Extract Skills
      progressBar.style.width = "35%";
      percentageLabel.innerText = "35%";
      statusLabel.innerText = "AI Engine: Extracting hidden skills...";
      
      const skillsResponse = await fetch(`${API_BASE_URL}/extract-skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, source_type: "resume" })
      });
      if (skillsResponse.ok) {
        extractedSkills = await skillsResponse.json();
      }

      // Step 2: Score Readiness
      progressBar.style.width = "60%";
      percentageLabel.innerText = "60%";
      statusLabel.innerText = "AI Engine: Calculating readiness alignments...";

      const readinessResponse = await fetch(`${API_BASE_URL}/evaluate-readiness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: text })
      });
      if (readinessResponse.ok) {
        readinessScore = await readinessResponse.json();
      }

      // Step 3: Explainability & Recommendations
      progressBar.style.width = "85%";
      percentageLabel.innerText = "85%";
      statusLabel.innerText = "AI Engine: Generating diagnostic explainability...";

      if (readinessScore && extractedSkills) {
        const target = extractedSkills.mapped_roles[0] || "Software Engineer";
        const recResponse = await fetch(`${API_BASE_URL}/recommendations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            readiness_scores: readinessScore,
            detected_skills: extractedSkills,
            target_role: target
          })
        });
        if (recResponse.ok) {
          recommendations = await recResponse.json();
        }

        const expResponse = await fetch(`${API_BASE_URL}/explain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            readiness_scores: readinessScore,
            evidence: { technical: extractedSkills.technical_skills },
            student_name: fileName.split(".")[0] || "Candidate"
          })
        });
        if (expResponse.ok) {
          explainability = await expResponse.json();
        }
      }
    }

    progressBar.style.width = "100%";
    percentageLabel.innerText = "100%";
    statusLabel.innerText = "Ingestion Complete! Syncing profile...";

    // Determine Candidate Name from File Name
    const rawName = fileName.split(".")[0];
    const candidateName = rawName.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Uploaded Profile";

    // Dynamic fallback if offline or API returns empty data
    if (!extractedSkills || !readinessScore) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Sim delay

      const lowerText = text.toLowerCase() + " " + fileName.toLowerCase();
      let tech = [];
      let soft = [];
      let role = "Software Engineer";
      let overall = 78;

      if (lowerText.includes("python") || lowerText.includes("data science") || lowerText.includes("analyst") || lowerText.includes("machine")) {
        tech = ["Python", "SQL", "Machine Learning", "Data Analysis", "Tableau"];
        soft = ["Analytical Thinking", "Attention to Detail"];
        role = "Data Scientist";
        overall = 85;
      } else if (lowerText.includes("agile") || lowerText.includes("scrum") || lowerText.includes("project") || lowerText.includes("business")) {
        tech = ["Agile PM", "Scrum Master", "SQL", "Tableau", "User Stories"];
        soft = ["Communication", "Stakeholder Alignment"];
        role = "Business Analyst";
        overall = 94;
      } else if (lowerText.includes("docker") || lowerText.includes("cloud") || lowerText.includes("aws") || lowerText.includes("devops") || lowerText.includes("kubernetes")) {
        tech = ["Docker", "AWS Cloud", "Kubernetes", "Linux Shell", "CI/CD"];
        soft = ["Systems Architecture", "Troubleshooting"];
        role = "DevOps Engineer";
        overall = 82;
      } else if (lowerText.includes("security") || lowerText.includes("cyber") || lowerText.includes("network")) {
        tech = ["Bash Scripting", "Penetration Testing", "Security Audits", "Network Protocols"];
        soft = ["Incident Response", "Vulnerability Analysis"];
        role = "Security Analyst";
        overall = 88;
      } else {
        tech = ["Java Core", "REST APIs", "Git Version Control", "Docker"];
        soft = ["Problem Solving", "Collaborative Coding"];
        role = "Backend Software Engineer";
        overall = 76;
      }

      extractedSkills = {
        technical_skills: tech,
        soft_skills: soft,
        mapped_roles: [role]
      };

      readinessScore = {
        overall_readiness: overall,
        technical: overall + 4,
        communication: 75,
        leadership: 70,
        problem_solving: overall + 2,
        industry_exposure: 68
      };

      explainability = {
        summary: `AI Diagnostic parsed profile for ${candidateName}. Detected capabilities in ${extractedSkills.technical_skills.join(", ")}. Mapped to targeted industry role ${role} with an overall readiness alignment of ${overall}%.`
      };
    }

    // Sync newly generated candidate to mockStudents list
    const parsedStudent = {
      id: "student_uploaded",
      name: candidateName,
      major: `Bachelor of Computer Science (${extractedSkills.mapped_roles[0] || "Software Engineering"})`,
      targetRole: extractedSkills.mapped_roles[0] || "Software Engineer",
      readiness: readinessScore.overall_readiness,
      compatibility: readinessScore.overall_readiness,
      skills: [
        ...extractedSkills.technical_skills.map(s => ({ name: s, verified: true })),
        ...extractedSkills.soft_skills.map(s => ({ name: s, verified: false }))
      ],
      competencies: {
        technical: readinessScore.technical || 80,
        analytical: readinessScore.problem_solving || 75,
        communication: readinessScore.communication || 70
      },
      portfolio: {
        avatar: candidateName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        description: `Custom profile generated from uploaded resume. Actively pursuing roles in ${extractedSkills.mapped_roles.join(", ")}.`,
        accomplishments: [
          { title: "Uploaded Resume Ingestion", provider: "UniOS AI Validator", link: "#", doc: "Resume Check", icon: "📄" }
        ]
      },
      xai: {
        summary: explainability ? explainability.summary : "No explanation provided.",
        strengths: ["Extracted profile matches target role directives", "Verified technical badges successfully parsed"],
        gaps: ["Verify additional transcript outcomes to improve readiness score"]
      }
    };

    // Replace or insert custom student at the top
    const existingIdx = mockStudents.findIndex(s => s.id === "student_uploaded");
    if (existingIdx >= 0) {
      mockStudents[existingIdx] = parsedStudent;
    } else {
      mockStudents.unshift(parsedStudent);
    }

    // Update global active selections
    selectedEvalCandidate = parsedStudent;

    // Apply names and details to headers
    document.getElementById("user-display-name").innerText = parsedStudent.name;
    document.getElementById("user-avatar-initial").innerText = parsedStudent.portfolio.avatar;
    document.getElementById("dashboard-insight-text").innerHTML = `<strong>AI Extraction Summary:</strong> ${parsedStudent.xai.summary}`;

    // Mark checklists verified
    document.getElementById("status-resume").className = "badge badge-verified";
    document.getElementById("status-resume").innerText = "Verified";
    document.getElementById("status-transcript").className = "badge badge-verified";
    document.getElementById("status-transcript").innerText = "Verified";
    document.getElementById("status-projects").className = "badge badge-verified";
    document.getElementById("status-projects").innerText = "Verified";
    document.getElementById("status-workshops").className = "badge badge-verified";
    document.getElementById("status-workshops").innerText = "Verified";

    // Redirect to dashboard
    setTimeout(() => {
      showScreen("student-dashboard");
    }, 1200);

  } catch (error) {
    console.error("Ingestion process error:", error);
    statusLabel.innerText = "Error: Ingestion failed. Please try again.";
  }
}

// ==============================================
// Screen 2: Student Dashboard & Progress Ring
// ==============================================
function animateReadinessRing(score) {
  const ring = document.getElementById("readiness-progress-ring");
  const label = document.getElementById("readiness-numerical-label");
  const radius = ring.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  
  ring.style.strokeDasharray = `${circumference} ${circumference}`;
  
  let currentScore = 0;
  const interval = setInterval(() => {
    currentScore += 1;
    const offset = circumference - (currentScore / 100) * circumference;
    ring.style.strokeDashoffset = offset;
    label.textContent = `${currentScore}%`;
    
    if (currentScore >= score) {
      clearInterval(interval);
    }
  }, 10);
}

function renderStudentDashboard() {
  const student = selectedEvalCandidate || mockStudents[1]; // default to Alice Tan

  // 1. Update target role header
  const targetRoleLabel = document.getElementById("student-target-role-label");
  if (targetRoleLabel) {
    targetRoleLabel.innerHTML = `Insight engine analyzing alignment toward <strong>Target Role: ${student.targetRole}</strong>`;
  }

  // 2. Animate progress ring with student's actual readiness score
  animateReadinessRing(student.readiness);

  // 3. Render Skill Gap List
  const skillGapList = document.getElementById("student-skill-gap-list");
  if (skillGapList) {
    skillGapList.innerHTML = "";
    // Show up to 4 skills
    const displaySkills = student.skills.slice(0, 4);
    displaySkills.forEach(skill => {
      const item = document.createElement("div");
      if (skill.verified) {
        item.innerHTML = `
          <div class="flex-between mb-12">
            <span class="mono-text">${skill.name}</span>
            <div class="verified-text">🛡️ ${skill.name} Verified</div>
          </div>
          <div class="progress-bar-container"><div class="progress-bar-fill" style="width: 100%; background-color: var(--state-verified);"></div></div>
        `;
      } else {
        item.innerHTML = `
          <div class="flex-between mb-12">
            <span class="mono-text">${skill.name}</span>
            <span style="color: var(--state-pending); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
              ⚠️ 50% Gap
            </span>
          </div>
          <div class="progress-bar-container"><div class="progress-bar-fill" style="width: 50%; background-color: var(--state-pending);"></div></div>
        `;
      }
      skillGapList.appendChild(item);
    });
  }

  // 4. Update the bottom AI Insight Banner with dynamic summary
  const insightText = document.getElementById("dashboard-insight-text");
  if (insightText) {
    insightText.innerHTML = `<strong>AI Extraction Summary:</strong> ${student.xai.summary}`;
  }
}

// ==============================================
// Screen 3: Career Discovery Hub
// ==============================================
function renderDiscoveryHub() {
  const matchedJobs = document.getElementById("matched-jobs-list");
  const upskilling = document.getElementById("upskilling-courses-list");
  const projects = document.getElementById("suggested-projects-list");

  matchedJobs.innerHTML = `
    <div class="card" style="padding: 16px; cursor: pointer;">
      <h4>FinTech Data Analyst</h4>
      <p style="font-size: 0.8rem; margin: 6px 0;">AmanPay Sourcing • Kuala Lumpur</p>
      <div class="flex-between">
        <span class="badge badge-verified">92% Match</span>
        <span style="font-size: 0.75rem; color: var(--accent-blue); font-weight:600;">View Job &rarr;</span>
      </div>
    </div>
    <div class="card" style="padding: 16px; cursor: pointer;">
      <h4>Business System Engineer</h4>
      <p style="font-size: 0.8rem; margin: 6px 0;">Digital Innovation Corp</p>
      <div class="flex-between">
        <span class="badge badge-verified">85% Match</span>
        <span style="font-size: 0.75rem; color: var(--accent-blue); font-weight:600;">View Job &rarr;</span>
      </div>
    </div>
  `;

  upskilling.innerHTML = `
    <div class="card" style="padding: 16px;">
      <h4>Advanced Tableau Master</h4>
      <p style="font-size: 0.8rem; margin: 6px 0; color: var(--state-pending);">Closes Data Viz Gap (Medium Priority)</p>
      <div class="flex-between">
        <span class="mono-text">4 Hours • Udemy</span>
        <button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem;">Enroll</button>
      </div>
    </div>
    <div class="card" style="padding: 16px;">
      <h4>Data Warehouse Engineering</h4>
      <p style="font-size: 0.8rem; margin: 6px 0; color: var(--text-muted);">Optional Exposure</p>
      <div class="flex-between">
        <span class="mono-text">12 Hours • Coursera</span>
        <button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem;">Enroll</button>
      </div>
    </div>
  `;

  projects.innerHTML = `
    <div class="card" style="padding: 16px;">
      <h4>Financial Analytics dashboard</h4>
      <p style="font-size: 0.8rem; margin: 6px 0;">Build an automated python pipeline visualizing churn trends.</p>
      <div style="text-align: right; margin-top: 10px;">
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="alert('Simulation Workspace Ready!')">Deploy Sandbox</button>
      </div>
    </div>
  `;
}

function launchSimulation() {
  document.getElementById("simulation-modal").classList.add("active");
  document.getElementById("simulation-step-1").style.display = "block";
  document.getElementById("simulation-feedback").style.display = "none";
}

function closeSimulationModal() {
  document.getElementById("simulation-modal").classList.remove("active");
}

function submitSimulationChoice(step, choice) {
  const step1 = document.getElementById("simulation-step-1");
  const feedback = document.getElementById("simulation-feedback");
  const feedbackCard = document.getElementById("simulation-feedback-card");

  step1.style.display = "none";
  feedback.style.display = "block";

  if (choice === "correct") {
    feedbackCard.innerHTML = `
      <h4 style="color: var(--state-verified); margin-bottom: 8px;">🟢 Option B: Optimal Choice!</h4>
      <p>Creating summary KPI cards combined with drill-down worksheets provides an outstanding user experience for executives. It hides unnecessary data noise while enabling analytical deep-dives. This increases your <strong>Analytical Score</strong> by <strong>+10%</strong>!</p>
    `;
  } else if (choice === "partial") {
    feedbackCard.innerHTML = `
      <h4 style="color: var(--state-pending); margin-bottom: 8px;">🟡 Option C: Sub-optimal (Partial credit)</h4>
      <p>Static reports can be useful, but they don't allow executives to filter data interactively. Consider utilizing interactive dashboard capabilities for dashboard design tasks.</p>
    `;
  } else {
    feedbackCard.innerHTML = `
      <h4 style="color: var(--state-gap); margin-bottom: 8px;">🔴 Option A: Poor Alignment</h4>
      <p>Executives require high-level summaries. Displaying all 50 dimensions on a single scatter plot creates visual overload and clutter. Try structuring your layouts with hierarchy.</p>
    `;
  }
}

// ==============================================
// Screen 4: Living Portfolio View
// ==============================================
function renderLivingPortfolio() {
  const grid = document.getElementById("portfolio-badges-grid");
  grid.innerHTML = "";

  const accomplishments = [
    { title: "AmanPay Analytics Engine", issuer: "Multimedia University Admin", doc: "Project Spec #A201", tag: "Technical Project" },
    { title: "National Data Hackathon 2024", issuer: "TechCorp Malaysia Committee", doc: "Rank 2 certificate", tag: "Competition" },
    { title: "Agile Scrum Master PSM I", issuer: "Scrum.org Accredited", doc: "Badge id #992837", tag: "Certification" }
  ];

  accomplishments.forEach(acc => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="flex-between mb-12">
        <span class="badge badge-verified">🛡️ Faculty Verified</span>
        <span class="mono-text" style="font-size: 0.75rem; color: var(--accent-blue);">${acc.tag}</span>
      </div>
      <h4 class="mb-12" style="font-size: 1.05rem;">${acc.title}</h4>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
        Verified by: <strong>${acc.issuer}</strong>
      </div>
      <div class="flex-between" style="border-top: 1px solid var(--border-light); padding-top: 12px;">
        <a href="#" class="mono-text" style="color: var(--accent-blue); text-decoration: none; font-size: 0.75rem;">Repository &rarr;</a>
        <a href="#" class="mono-text" style="color: var(--accent-blue); text-decoration: none; font-size: 0.75rem;">Proof Document</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function copyProfileLink() {
  alert("Profile share link copied to clipboard: https://unios.app/portfolio/ahmad-faris");
}

// ==============================================
// University: Course Intake admin grid
// ==============================================
function renderIntakeTable() {
  const tbody = document.getElementById("course-intake-table-body");
  tbody.innerHTML = "";

  const courses = [
    { code: "SEC-3013", name: "Structured SQL Database Querying", map: "SQL Core, Index Tuning", scan: "2026-06-10", status: "Mapped" },
    { code: "SEC-3022", name: "Agile Project Management Systems", map: "Scrum Frameworks, Kanban", scan: "2026-06-11", status: "Mapped" },
    { code: "SEC-4001", name: "Cloud Labs & Infrastructure Design", map: "AWS, Docker deployments", scan: "2026-06-13", status: "Processing" }
  ];

  courses.forEach(c => {
    const tr = document.createElement("tr");
    const statusDot = c.status === "Mapped" 
      ? '<span style="color: var(--state-verified);">🟢 Fully Mapped</span>' 
      : '<span style="color: var(--state-pending);">🟡 Processing AI</span>';
    tr.innerHTML = `
      <td class="mono-text" style="font-weight: 700;">${c.code}</td>
      <td>${c.name}</td>
      <td><span class="mono-text">${c.map}</span></td>
      <td>${c.scan}</td>
      <td>${statusDot}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openSyllabusModal() {
  document.getElementById("syllabus-modal").classList.add("active");
  const bar = document.getElementById("syllabus-progress-bar");
  const label = document.getElementById("syllabus-status-label");
  const actionBtn = document.getElementById("syllabus-modal-action-btn");
  
  actionBtn.disabled = true;
  bar.style.width = "55%";
  label.innerText = "Text Extraction Complete (55%)";

  setTimeout(() => {
    bar.style.width = "85%";
    label.innerText = "AI Alignment Parser analysis (85%)";
  }, 1000);

  setTimeout(() => {
    bar.style.width = "100%";
    label.innerText = "Parsing Complete (100%)";
    actionBtn.disabled = false;
  }, 2200);
}

function closeSyllabusModal() {
  document.getElementById("syllabus-modal").classList.remove("active");
}

function finishSyllabusParsing() {
  closeSyllabusModal();
  alert("Syllabus alignments imported successfully! Map Matrix updated.");
  showScreen("university-matrix");
}

// ==============================================
// University: Heatmap Grid
// ==============================================
function renderHeatmapMatrix() {
  const table = document.getElementById("heatmap-matrix-table");
  table.innerHTML = "";

  // Header row
  const headerTr = document.createElement("tr");
  headerTr.innerHTML = "<th>Course Code / Title</th>";
  mockCurriculumMatrix.skills.forEach(skill => {
    headerTr.innerHTML += `<th>${skill}</th>`;
  });
  table.appendChild(headerTr);

  // Body rows
  mockCurriculumMatrix.courses.forEach(course => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td style="font-weight: 600;">${course.code} - ${course.name}</td>`;
    
    mockCurriculumMatrix.skills.forEach(skill => {
      const level = course.skills[skill] || "level-gap";
      const cellText = level === "level-high" ? "High" : level === "level-medium" ? "Med" : level === "level-low" ? "Low" : "Gap";
      tr.innerHTML += `<td class="heatmap-cell ${level}" onclick="inspectHeatmapCell('${course.code}', '${skill}', '${level}')">${cellText}</td>`;
    });
    table.appendChild(tr);
  });
}

function inspectHeatmapCell(courseCode, skill, level) {
  const modal = document.getElementById("heatmap-inspect-modal");
  const title = document.getElementById("inspect-modal-title");
  const desc = document.getElementById("inspect-modal-alignment-desc");
  const cloList = document.getElementById("inspect-modal-clo-list");

  title.innerText = `Matrix Cell: ${courseCode} (${skill})`;
  desc.innerHTML = `Coverage strength: <strong style="color: var(--accent-blue); text-transform: uppercase;">${level.replace("level-", "")}</strong>`;
  
  cloList.innerHTML = "";
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

  const currentClos = mockClos[level] || [];
  currentClos.forEach(clo => {
    const li = document.createElement("li");
    li.innerText = clo;
    cloList.appendChild(li);
  });

  modal.classList.add("active");
}

function closeHeatmapModal() {
  document.getElementById("heatmap-inspect-modal").classList.remove("active");
}

// ==============================================
// University: Analytics Charts
// ==============================================
function renderCohortAttainmentChart() {
  const ctx = document.getElementById("cohort-attainment-chart").getContext("2d");
  
  if (cohortChart) {
    cohortChart.destroy();
  }

  cohortChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Sem 1, 2024', 'Sem 2, 2024', 'Sem 1, 2025', 'Sem 2, 2025'],
      datasets: [
        {
          label: 'Technical Core (SQL/Python)',
          data: [62, 70, 78, 85],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 2,
          fill: true
        },
        {
          label: 'Agile & Industry PM',
          data: [50, 58, 62, 74],
          borderColor: '#06B6D4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          borderWidth: 2,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        y: { min: 0, max: 100 }
      }
    }
  });
}

function renderCurriculumImprovements() {
  const container = document.getElementById("curriculum-improvements-list");
  container.innerHTML = `
    <div class="checklist-item">
      <label class="checklist-label">
        <input type="checkbox" checked style="margin-right: 8px;">
        <div>
          <strong>Append 'Kubernetes Deployments' to SEC-4001 Cloud Lab.</strong>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Reason: Required in 45% of partner job listings.</p>
        </div>
      </label>
    </div>
    <div class="checklist-item">
      <label class="checklist-label">
        <input type="checkbox" style="margin-right: 8px;">
        <div>
          <strong>Add 'Tableau Dashboard' visual models to SEC-3013 SQL.</strong>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Reason: Highlighted as gap in 30% of Student cohort analytics.</p>
        </div>
      </label>
    </div>
  `;
}

function applyCurriculumUpdates() {
  alert("Applying curriculum updates to academic matrices. Reloading matrix mappings...");
  showScreen("university-matrix");
}

// ==============================================
// Employer Search & Filters
// ==============================================
function setupEmployerFilters() {
  const skillInput = document.getElementById("filter-skill-input");
  const majorSelect = document.getElementById("filter-major-select");

  skillInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && skillInput.value.trim()) {
      const skill = skillInput.value.trim();
      if (!filterSkills.includes(skill)) {
        filterSkills.push(skill);
        renderFilterPills();
        renderCandidatesSearch();
      }
      skillInput.value = "";
    }
  });

  majorSelect.addEventListener("change", () => {
    renderCandidatesSearch();
  });
}

function renderFilterPills() {
  const container = document.getElementById("filter-skills-container");
  container.innerHTML = "";
  
  filterSkills.forEach(skill => {
    const pill = document.createElement("span");
    pill.className = "tag-pill";
    pill.innerHTML = `
      ${skill}
      <button onclick="removeFilterSkill('${skill}')">&times;</button>
    `;
    container.appendChild(pill);
  });
}

function removeFilterSkill(skill) {
  filterSkills = filterSkills.filter(s => s !== skill);
  renderFilterPills();
  renderCandidatesSearch();
}

function toggleVerifiedOnly() {
  const checkbox = document.getElementById("verified-only-checkbox");
  if (checkbox) {
    verifiedOnly = checkbox.checked;
  }
  renderCandidatesSearch();
}

function renderCandidatesSearch() {
  renderFilterPills();
  const list = document.getElementById("matching-candidates-list");
  list.innerHTML = "";

  const selectedMajor = document.getElementById("filter-major-select").value;

  // Filter students
  const filtered = mockStudents.filter(student => {
    // Check major
    if (selectedMajor && student.major !== selectedMajor) return false;

    // Check skills (aligned with verified filter if toggle is active)
    if (filterSkills.length > 0) {
      const match = filterSkills.some(fs => 
        student.skills.some(ss => {
          const nameMatch = ss.name.toLowerCase() === fs.toLowerCase();
          if (verifiedOnly) {
            return nameMatch && ss.verified;
          }
          return nameMatch;
        })
      );
      if (!match) return false;
    } else if (verifiedOnly) {
      // If no specific skills filtered but Verified Only is active, show candidates with at least one verified skill
      const hasVerified = student.skills.some(s => s.verified);
      if (!hasVerified) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">No matching candidates found.</p>`;
    return;
  }

  filtered.forEach(student => {
    const isShortlisted = shortlist.some(s => s.id === student.id);
    const starClass = isShortlisted ? "active" : "";
    const starText = isShortlisted ? "★ Shortlisted" : "⭐ Add to Shortlist";
    const bgStyle = isShortlisted ? "background-color: var(--state-pending-bg); border-color: var(--state-pending);" : "";

    const card = document.createElement("div");
    card.className = "candidate-card";
    card.style = bgStyle;
    card.innerHTML = `
      <input type="checkbox" class="candidate-checkbox" onclick="event.stopPropagation()">
      <div class="candidate-card-body" onclick="openCandidateEval('${student.id}')">
        <div class="candidate-card-header">
          <div class="candidate-name-section">
            <div class="candidate-avatar-placeholder">${student.portfolio.avatar}</div>
            <div>
              <strong>${student.name}</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${student.major}</p>
            </div>
          </div>
          <span class="candidate-match-score">${student.compatibility}% Match</span>
        </div>
        <div class="candidate-skills-wrap">
          ${student.skills.map(s => `
            <span class="badge ${s.verified ? 'badge-verified' : 'badge-optional'}">
              ${s.name} ${s.verified ? '🛡️' : ''}
            </span>
          `).join('')}
        </div>
        <div class="candidate-card-footer">
          <button class="btn btn-secondary ${starClass}" style="padding: 6px 12px; font-size: 0.8rem;" onclick="event.stopPropagation(); toggleShortlist('${student.id}')">
            ${starText}
          </button>
          <a href="#" class="mono-text" style="color: var(--accent-blue); text-decoration: none; font-size: 0.8rem; white-space: nowrap;" onclick="event.stopPropagation(); openCandidateEval('${student.id}')">
            View Profile &rarr;
          </a>
        </div>
      </div>
    `;
    list.appendChild(card);
  });

  // Update navbar shortlisted badge count
  document.getElementById("shortlist-count-badge").innerText = shortlist.length;
}

function toggleShortlist(studentId) {
  const student = mockStudents.find(s => s.id === studentId);
  if (!student) return;

  const index = shortlist.findIndex(s => s.id === studentId);
  if (index >= 0) {
    shortlist.splice(index, 1);
  } else {
    shortlist.push(student);
  }
  
  renderCandidatesSearch();
}

// ==============================================
// Employer: Deep Evaluation View
// ==============================================
function openCandidateEval(studentId) {
  const student = mockStudents.find(s => s.id === studentId);
  if (student) {
    selectedEvalCandidate = student;
    showScreen("employer-candidate");
  }
}

function renderDeepEvaluation() {
  const student = selectedEvalCandidate;
  if (!student) return;

  document.getElementById("eval-candidate-name").innerText = student.name;
  document.getElementById("eval-candidate-major").innerText = `Major: ${student.major} | Target: ${student.targetRole}`;
  document.getElementById("eval-compatibility-score").innerText = `${student.compatibility}%`;

  // Update shortlisted button
  const toggleBtn = document.getElementById("eval-shortlist-toggle");
  const isShortlisted = shortlist.some(s => s.id === student.id);
  if (isShortlisted) {
    toggleBtn.className = "btn btn-primary active";
    toggleBtn.style.backgroundColor = "var(--state-pending)";
    toggleBtn.style.color = "var(--text-light)";
    toggleBtn.innerHTML = "★ Shortlisted";
  } else {
    toggleBtn.className = "btn btn-secondary";
    toggleBtn.style.backgroundColor = "";
    toggleBtn.style.color = "";
    toggleBtn.innerHTML = "⭐ Add to Shortlist";
  }

  // Draw competency bars
  const barsContainer = document.querySelector("#view-employer-candidate .card div[style*='display: flex']");
  barsContainer.innerHTML = `
    <div>
      <div class="flex-between mb-12">
        <span>Technical Core Skills</span>
        <strong>${student.competencies.technical}%</strong>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${student.competencies.technical}%;"></div>
      </div>
    </div>
    <div>
      <div class="flex-between mb-12">
        <span>Analytical Capabilities</span>
        <strong>${student.competencies.analytical}%</strong>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${student.competencies.analytical}%;"></div>
      </div>
    </div>
    <div>
      <div class="flex-between mb-12">
        <span>Communication Skills</span>
        <strong>${student.competencies.communication}%</strong>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${student.competencies.communication}%;"></div>
      </div>
    </div>
  `;

  // Render simulator viewport living portfolio
  const viewport = document.getElementById("eval-portfolio-viewport");
  viewport.innerHTML = `
    <div style="background-color: var(--primary-navy); color: #FFFFFF; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background-color: var(--accent-blue); display:flex; align-items:center; justify-content:center; font-weight:700;">
          ${student.portfolio.avatar}
        </div>
        <div>
          <h4 style="color:#FFFFFF; margin:0;">${student.name}</h4>
          <span style="font-size:0.75rem; color:#94A3B8;">Accredited public Portfolio</span>
        </div>
      </div>
    </div>
    <h5 style="margin-bottom:8px;">Extracted & Verified Accomplishments</h5>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${student.portfolio.accomplishments.map(acc => `
        <div class="card" style="padding: 10px 14px; box-shadow:none;">
          <div class="flex-between" style="font-size:0.8rem;">
            <span>${acc.icon} <strong>${acc.title}</strong></span>
            <span class="verified-text">🛡️ Verified</span>
          </div>
          <p style="font-size:0.75rem; margin-top:4px;">Issuer: ${acc.provider}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleShortlistEval() {
  if (selectedEvalCandidate) {
    toggleShortlist(selectedEvalCandidate.id);
    renderDeepEvaluation();
  }
}

// XAI report popup
function showXaiReport() {
  if (!selectedEvalCandidate) return;
  const modal = document.getElementById("xai-report-modal");
  
  document.getElementById("xai-summary-text").innerText = selectedEvalCandidate.xai.summary;
  
  const strengthsUl = document.getElementById("xai-strengths-list");
  strengthsUl.innerHTML = "";
  selectedEvalCandidate.xai.strengths.forEach(s => {
    const li = document.createElement("li");
    li.innerText = s;
    strengthsUl.appendChild(li);
  });

  const gapsUl = document.getElementById("xai-gaps-list");
  gapsUl.innerHTML = "";
  selectedEvalCandidate.xai.gaps.forEach(g => {
    const li = document.createElement("li");
    li.innerText = g;
    gapsUl.appendChild(li);
  });

  modal.classList.add("active");
}

function closeXaiModal() {
  document.getElementById("xai-report-modal").classList.remove("active");
}

// Recruiter feedback rating selection
function setupStarRatings() {
  const stars = document.querySelectorAll("#feedback-stars .star");
  stars.forEach(star => {
    star.addEventListener("click", () => {
      const val = parseInt(star.getAttribute("data-value"));
      stars.forEach(s => {
        const sVal = parseInt(s.getAttribute("data-value"));
        if (sVal <= val) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });
}

function submitFeedback() {
  const comment = document.getElementById("feedback-comment").value;
  alert(`Recruiter feedback submitted successfully! Notes logged: "${comment}"`);
  document.getElementById("feedback-comment").value = "";
  document.querySelectorAll("#feedback-stars .star").forEach(s => s.classList.remove("active"));
}

// ==============================================
// Employer: Shortlist Pipeline
// ==============================================
function renderShortlistPipeline() {
  const container = document.getElementById("shortlist-candidates-list");
  container.innerHTML = "";

  document.getElementById("shortlist-metrics-count").innerText = shortlist.length;
  document.getElementById("shortlist-metrics-count").innerText = shortlist.length;

  if (shortlist.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">No candidates shortlisted yet. Head back to the Search Directory.</p>`;
    return;
  }

  shortlist.forEach(student => {
    const row = document.createElement("div");
    row.className = "card";
    row.style = "margin-bottom:16px;";
    row.innerHTML = `
      <div class="flex-between mb-12">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="candidate-avatar-placeholder" style="width:36px; height:36px;">${student.portfolio.avatar}</div>
          <div>
            <h4 style="margin:0;">${student.name}</h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">${student.major}</span>
          </div>
        </div>
        <span class="candidate-match-score">${student.compatibility}% Match</span>
      </div>
      <div class="candidate-skills-wrap">
        ${student.skills.map(s => `
          <span class="badge ${s.verified ? 'badge-verified' : 'badge-optional'}">
            ${s.name} ${s.verified ? '🛡️' : ''}
          </span>
        `).join('')}
      </div>
      <div class="candidate-card-footer" style="border-top:1px solid #F1F5F9; padding-top:16px; margin-top:16px;">
        <button class="btn btn-primary active" style="background-color: var(--state-pending); border:none; padding:6px 12px; font-size:0.8rem;" onclick="toggleShortlist('${student.id}'); renderShortlistPipeline();">
          ★ Shortlisted
        </button>
        <button class="btn btn-primary" style="padding:6px 12px; font-size:0.8rem;" onclick="openInterviewModal('${student.name}')">
          Evaluate Fit & Run Interview Simulation
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}

function exportShortlist() {
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
}

let activeInterviewCandidateName = "";

function openInterviewModal(name) {
  activeInterviewCandidateName = name;
  document.getElementById("interview-modal").classList.add("active");
  const chatHistory = document.getElementById("interview-chat-history");
  chatHistory.innerHTML = `
    <div class="chat-bubble-ai">
      <strong>${name} (AI Candidate):</strong> Hello! I am the AI persona of ${name}. Thank you for initiating this fit evaluation. Feel free to ask me anything about my background, skills, or portfolio!
    </div>
  `;
}

function closeInterviewModal() {
  document.getElementById("interview-modal").classList.remove("active");
}

function sendInterviewMessage() {
  const input = document.getElementById("interview-chat-input");
  const text = input.value.trim();
  if (!text) return;

  const chatHistory = document.getElementById("interview-chat-history");
  
  // User (Recruiter) message
  const userDiv = document.createElement("div");
  userDiv.className = "chat-bubble-user";
  userDiv.innerHTML = `<strong>You (Recruiter):</strong> ${text}`;
  chatHistory.appendChild(userDiv);
  
  input.value = "";
  
  const name = activeInterviewCandidateName || "Candidate";
  
  // AI Candidate reply after 800ms
  setTimeout(() => {
    const aiDiv = document.createElement("div");
    aiDiv.className = "chat-bubble-ai";
    
    // Generate context-aware response based on the candidate's name and input text
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
    
    aiDiv.innerHTML = `<strong>${name} (AI Candidate):</strong> ${responseText}`;
    chatHistory.appendChild(aiDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }, 800);
}

// ==============================================
// Light / Dark Theme Management
// ==============================================
function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-theme");
  const isDark = body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  
  updateThemeIcons(isDark);
}

function loadUserTheme() {
  const savedTheme = localStorage.getItem("theme");
  const isDark = (savedTheme === "dark");
  if (isDark) {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
  updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
  const sunSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`;
  const moonSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>`;
  
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.innerHTML = isDark ? sunSvg : moonSvg;
  }
  const landingIcon = document.getElementById("theme-icon-landing");
  if (landingIcon) {
    landingIcon.innerHTML = isDark ? sunSvg : moonSvg;
  }
}

// ==============================================
// AI Resume Booster & ATS Optimizer
// ==============================================
async function optimizeResumeBullets() {
  const roleInput = document.getElementById("booster-role-input");
  const inputTextArea = document.getElementById("booster-input-bullets");
  const loadingState = document.getElementById("booster-loading-state");
  const outputContainer = document.getElementById("booster-output-container");

  const targetRole = roleInput ? roleInput.value.trim() : "Data Scientist";
  const rawText = inputTextArea ? inputTextArea.value : "";

  // Split and filter empty lines
  const rawBullets = rawText.split("\n").map(b => b.trim()).filter(b => b.length > 0);

  if (rawBullets.length === 0) {
    alert("Please enter at least one resume bullet point to optimize.");
    return;
  }

  // Show loading state, hide previous output
  if (loadingState) loadingState.style.display = "block";
  if (outputContainer) outputContainer.innerHTML = "";

  // Mock fallbacks if API is unavailable
  const mockRewrites = {
    "Data Scientist": {
      "helped build a customer churn prediction model using python": "Engineered a predictive customer churn model using Python and Scikit-Learn, increasing prediction accuracy by 14% and reducing churn rate.",
      "was involved in cleaning and preprocessing dataset": "Architected scalable ETL data preprocessing pipelines for 1.2M+ records, ensuring data cleanliness and reducing preprocessing latency by 25%.",
      "assisted in creating a dashboard in tableau for the team": "Designed and deployed interactive Tableau business dashboards, enabling real-time stakeholder insights and cross-functional decision alignment."
    },
    "Business Analyst": {
      "helped build a customer churn prediction model using python": "Conducted quantitative churn prediction model audits in Python, translating data insights into actionable retention strategies.",
      "was involved in cleaning and preprocessing dataset": "Streamlined data preparation workflows for client demographics, improving reporting data integrity by 30%.",
      "assisted in creating a dashboard in tableau for the team": "Built dynamic Tableau performance dashboards, enabling self-service business intelligence access for 15+ department managers."
    },
    "Backend Software Engineer": {
      "helped build a customer churn prediction model using python": "Deployed machine learning prediction models as high-throughput REST APIs in Python/FastAPI, lowering inference response times to <50ms.",
      "was involved in cleaning and preprocessing dataset": "Designed high-performance database schema indexes and ingestion scripts, reducing database lock-up events by 40%.",
      "assisted in creating a dashboard in tableau for the team": "Developed custom SQL database query views to aggregate analytics data for Tableau dashboard integrations."
    },
    "Security Analyst": {
      "helped build a customer churn prediction model using python": "Developed secure python scripts to clean and parse log data for anomalous customer behavior prediction models.",
      "was involved in cleaning and preprocessing dataset": "Sanitized and preprocessed high-volume network security logs to support automated threat detection algorithms.",
      "assisted in creating a dashboard in tableau for the team": "Designed and configured real-time security incident response dashboards in Tableau, tracking vulnerability mitigation KPIs."
    }
  };

  try {
    const isConnected = await checkApiConnection();
    let rewrittenBullets = [];

    if (isConnected) {
      const response = await fetch(`${API_BASE_URL}/rewrite-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          raw_bullets: rawBullets,
          target_role: targetRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        rewrittenBullets = data.rewritten_bullets || [];
      }
    }

    // Fall back to intelligent mock data if connection fails or response is empty
    if (rewrittenBullets.length === 0) {
      // Simulated delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));

      const roleLower = targetRole.toLowerCase();

      rewrittenBullets = rawBullets.map(bullet => {
        const lowerBullet = bullet.toLowerCase();
        
        // Exact / partial match in mock templates
        const roleMock = mockRewrites[targetRole] || {};
        for (const [key, replacement] of Object.entries(roleMock)) {
          if (lowerBullet.includes(key) || key.includes(lowerBullet)) {
            return replacement;
          }
        }

        // Smart dynamic target-role-aware generators
        let actionVerbs = ["Optimized", "Spearheaded", "Architected", "Accelerated", "Formulated", "Revamped", "Synthesized"];
        let metrics = [
          "boosting operational throughput by 18%",
          "reducing execution latency by 35%",
          "driving a 12% growth in system adoption",
          "improving overall data pipeline accuracy by 15%",
          "streamlining cross-functional team reporting workflows"
        ];

        if (roleLower.includes("frontend") || roleLower.includes("web") || roleLower.includes("ui") || roleLower.includes("ux") || roleLower.includes("react") || roleLower.includes("angular") || roleLower.includes("vue")) {
          actionVerbs = ["Engineered", "Designed", "Refactored", "Optimized", "Spearheaded", "Implemented"];
          metrics = [
            "improving page load speeds by 42% and enhancing responsiveness",
            "increasing user engagement metrics by 15% through modern UX implementations",
            "reducing UI component rendering latency by 30% using reusable layouts",
            "achieving complete cross-browser compatibility and mobile responsiveness",
            "streamlining user flows, resulting in a 20% reduction in user drop-offs"
          ];
        } else if (roleLower.includes("devops") || roleLower.includes("cloud") || roleLower.includes("sre") || roleLower.includes("infrastructure") || roleLower.includes("aws") || roleLower.includes("docker") || roleLower.includes("kubernetes")) {
          actionVerbs = ["Automated", "Architected", "Deployed", "Streamlined", "Orchestrated", "Provisioned"];
          metrics = [
            "reducing deployment cycle times by 50% using CI/CD automation pipelines",
            "achieving 99.99% infrastructure availability via container orchestration",
            "minimizing cloud resource expenditure by 22% through auto-scaling groups",
            "optimizing system deployment pipelines and increasing operational efficiency",
            "strengthening cluster security postures and reducing incident response times"
          ];
        } else if (roleLower.includes("data") || roleLower.includes("science") || roleLower.includes("analytics") || roleLower.includes("machine") || roleLower.includes("ai") || roleLower.includes("deep") || roleLower.includes("tableau") || roleLower.includes("powerbi")) {
          actionVerbs = ["Engineered", "Synthesized", "Formulated", "Modelled", "Optimized", "Architected"];
          metrics = [
            "increasing prediction accuracy by 14% and minimizing modeling errors",
            "reducing dataset preprocessing overhead and runtime latency by 25%",
            "enabling real-time business insights for executive decision-makers",
            "boosting analytical query performance by 40% using optimized schemas",
            "extracting key behavioral dimensions from 1.5M+ unstructured records"
          ];
        }

        const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];

        // Clean up leading lowercase verbs/words
        let cleanBullet = bullet.charAt(0).toUpperCase() + bullet.slice(1);
        if (cleanBullet.toLowerCase().startsWith("helped ")) {
          cleanBullet = cleanBullet.slice(7);
        } else if (cleanBullet.toLowerCase().startsWith("was involved in ")) {
          cleanBullet = cleanBullet.slice(16);
        } else if (cleanBullet.toLowerCase().startsWith("assisted in ")) {
          cleanBullet = cleanBullet.slice(12);
        }

        return `${randomVerb} and executed tasks to ${cleanBullet.charAt(0).toLowerCase() + cleanBullet.slice(1)}, ${randomMetric}.`;
      });
    }

    // Hide loading state
    if (loadingState) loadingState.style.display = "none";

    // Render output
    if (outputContainer) {
      outputContainer.innerHTML = "";
      rewrittenBullets.forEach(bullet => {
        const card = document.createElement("div");
        card.className = "card";
        card.style = "padding: 14px; display: flex; justify-content: space-between; align-items: center; gap: 12px; border-left: 4px solid var(--accent-teal); box-shadow: var(--brand-glow);";
        card.innerHTML = `
          <div style="flex-grow: 1; font-size: 0.85rem; line-height: 1.4; color: var(--text-dark);">${bullet}</div>
          <button class="btn btn-secondary" style="padding: 6px 10px; font-size: 0.75rem; white-space: nowrap;" onclick="navigator.clipboard.writeText('${bullet.replace(/'/g, "\\'")}') ; alert('Copied to clipboard!')">Copy</button>
        `;
        outputContainer.appendChild(card);
      });
    }

  } catch (error) {
    console.error("Resume booster error:", error);
    if (loadingState) loadingState.style.display = "none";
    if (outputContainer) {
      outputContainer.innerHTML = `<p style="color: var(--state-gap); font-weight: 600;">An unexpected error occurred while boosting bullets. Please try again.</p>`;
    }
  }
}

// ==============================================
// University: Curriculum Insights & Market Mapping
// ==============================================
function populateSyllabusTemplate() {
  const select = document.getElementById("insights-course-select");
  const textarea = document.getElementById("insights-syllabus-input");
  if (!select || !textarea) return;

  const templates = {
    "SEC-3013": "Course Title: Structured SQL Database Querying\n\nDescription: Introduces relational database theory, database normalization, and structured query writing. Students will design relational schemas and optimize slow-running database queries.\n\nLearning Outcomes:\n- Formulate advanced SQL joins, subqueries, and aggregation queries.\n- Analyze database execution plans and optimize slow-running queries using index tuning.\n- Design Relational Schema structures to prevent database redundancy.",
    "SEC-3022": "Course Title: Agile Project Management Systems\n\nDescription: Focuses on software engineering project management processes using Agile methodologies. Covers scrum frameworks, kanban methodologies, sprint planning, and backlog optimization.\n\nLearning Outcomes:\n- Implement Scrum Framework and sprint lifecycle milestones.\n- Configure Kanban boards for project tracking.\n- Synthesize user stories and backlog priority matrices.",
    "SEC-4001": "Course Title: Cloud Labs & Infrastructure Design\n\nDescription: Core systems engineering course covering cloud deployment models, server virtualization, and containers.\n\nLearning Outcomes:\n- Deploy Docker containers and configure container networks.\n- Manage cloud architecture deployments on Amazon Web Services (AWS) using EC2 and S3.\n- Orchestrate deployment pipelines using CI/CD practices.",
    "custom": ""
  };

  textarea.value = templates[select.value] || "";
}

async function extractSyllabusInsights() {
  const textarea = document.getElementById("insights-syllabus-input");
  const loadingState = document.getElementById("insights-loading-state");
  const placeholder = document.getElementById("insights-output-placeholder");
  const container = document.getElementById("insights-output-container");

  const text = textarea ? textarea.value.trim() : "";
  if (!text) {
    alert("Please select a syllabus or enter custom description first.");
    return;
  }

  // Show loading state, hide other outputs
  if (loadingState) loadingState.style.display = "block";
  if (placeholder) placeholder.style.display = "none";
  if (container) container.style.display = "none";

  // Mock fallbacks if API is unavailable
  const mockSyllabusData = {
    "SEC-3013": {
      technical_skills: ["SQL Core", "PostgreSQL", "Database Normalization", "Index Tuning", "Query Optimization"],
      soft_skills: ["Analytical Thinking", "Problem Solving", "Attention to Detail"],
      mapped_roles: ["Database Administrator", "Backend Software Engineer", "Data Analyst"]
    },
    "SEC-3022": {
      technical_skills: ["Scrum Framework", "Kanban Methodology", "Sprint Planning", "Jira Configuration", "Backlog Grooming"],
      soft_skills: ["Team Leadership", "Agile Collaboration", "Effective Communication"],
      mapped_roles: ["Scrum Master", "Project Manager", "Agile Delivery Lead"]
    },
    "SEC-4001": {
      technical_skills: ["AWS Infrastructure", "Docker Containers", "CI/CD Pipelines", "Linux Administration", "Kubernetes Clustering"],
      soft_skills: ["Systems Architecture", "Troubleshooting", "Critical Analysis"],
      mapped_roles: ["DevOps Engineer", "Cloud Architect", "Site Reliability Engineer"]
    }
  };

  try {
    const isConnected = await checkApiConnection();
    let extractedData = null;

    if (isConnected) {
      const response = await fetch(`${API_BASE_URL}/extract-skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          source_type: "syllabus"
        })
      });

      if (response.ok) {
        extractedData = await response.json();
      }
    }

    // Fall back to intelligent mock data if connection fails or response is empty
    if (!extractedData) {
      // simulated delay for realism
      await new Promise(resolve => setTimeout(resolve, 1000));

      const select = document.getElementById("insights-course-select");
      const selectedValue = select ? select.value : "custom";

      if (selectedValue !== "custom" && mockSyllabusData[selectedValue]) {
        extractedData = mockSyllabusData[selectedValue];
      } else {
        // Smart keyword extraction for custom text inputs
        const lowerText = text.toLowerCase();
        const techSkills = [];
        const softSkills = ["Analytical Thinking", "Critical Reasoning"];
        const mappedRoles = ["Curriculum Specialist"];

        if (lowerText.includes("python")) {
          techSkills.push("Python Programming");
          mappedRoles.push("Software Developer");
        }
        if (lowerText.includes("sql") || lowerText.includes("database")) {
          techSkills.push("SQL Querying", "Relational Database Design");
          mappedRoles.push("Database Administrator");
        }
        if (lowerText.includes("docker") || lowerText.includes("container") || lowerText.includes("cloud") || lowerText.includes("aws")) {
          techSkills.push("Cloud Deployments", "Containerization");
          mappedRoles.push("Cloud Engineer");
        }
        if (lowerText.includes("agile") || lowerText.includes("scrum") || lowerText.includes("project")) {
          techSkills.push("Agile Project Management", "Scrum Framework");
          mappedRoles.push("Scrum Master");
        }
        if (lowerText.includes("machine learning") || lowerText.includes("ai") || lowerText.includes("data science")) {
          techSkills.push("Machine Learning Modeling", "Data Science Analytics");
          mappedRoles.push("Data Scientist");
        }
        if (lowerText.includes("security") || lowerText.includes("cryptography") || lowerText.includes("network")) {
          techSkills.push("Network Security", "Vulnerability Assessment");
          mappedRoles.push("Security Analyst");
        }
        if (techSkills.length === 0) {
          techSkills.push("Curriculum Design", "Outcome Ingestion");
        }

        extractedData = {
          technical_skills: techSkills,
          soft_skills: softSkills,
          mapped_roles: mappedRoles
        };
      }
    }

    // Render outcomes in the UI
    if (loadingState) loadingState.style.display = "none";
    if (container) {
      container.style.display = "flex";

      const rolesDiv = document.getElementById("insights-mapped-roles");
      const techDiv = document.getElementById("insights-tech-skills");
      const softDiv = document.getElementById("insights-soft-skills");

      rolesDiv.innerHTML = extractedData.mapped_roles.map(role => `
        <span class="badge badge-verified" style="background-color: var(--state-pending-bg); color: var(--state-pending); border-color: var(--state-pending-border);">
          💼 ${role}
        </span>
      `).join('');

      techDiv.innerHTML = extractedData.technical_skills.map(skill => `
        <span class="badge badge-verified">
          ⚙️ ${skill}
        </span>
      `).join('');

      softDiv.innerHTML = extractedData.soft_skills.map(skill => `
        <span class="badge badge-optional">
          ✦ ${skill}
        </span>
      `).join('');
    }

  } catch (error) {
    console.error("Syllabus insight error:", error);
    if (loadingState) loadingState.style.display = "none";
    if (placeholder) {
      placeholder.style.display = "block";
      placeholder.innerHTML = `<p style="color: var(--state-gap); font-weight:600;">An unexpected error occurred while analyzing the syllabus. Please try again.</p>`;
    }
  }
}
