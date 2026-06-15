# CareerOS — AI & Machine Learning Service Integration Guide

This guide provides instructions and complete, copy-pasteable code to integrate the AI/ML layer (`hao` folder) with both frontend and backend systems. It supports both local development and zero-configuration hosting on **Vercel**.

---

### Step 1: Backend Integration (FastAPI Setup)

The AI layer is written in pure asynchronous Python. To support Serverless deployment on **Vercel**, the API code should be structured within `api/index.py`.

#### 1. Install Dependencies
Run the following command in the project root directory to install the necessary packages:
```bash
pip install -r hao/requirements.txt fastapi uvicorn
```

#### 2. Configure Environment Variables (`.env`)
Create a `.env` file in the project root directory and add the API keys:
```env
GROQ_API_KEY="your_groq_api_key"
OPENROUTER_API_KEY="your_openrouter_api_key"
```

**🔑 How to get the API Keys (Both are FREE):**
- **Groq API Key**: Go to [console.groq.com/keys](https://console.groq.com/keys), sign in, and click "Create API Key".
- **OpenRouter API Key**: Go to [openrouter.ai/keys](https://openrouter.ai/keys), sign in, and click "Create Key".

*(Note: For Vercel production deployment, configure these keys under the **Environment Variables** section in the Vercel Dashboard).*

#### 3. Complete Server Code (`api/index.py`)
Create an `api/` folder in the project root directory, create a new file named `index.py`, and paste the following code:

```python
# api/index.py
import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict

# Ensure Vercel can locate the 'hao' module in the root directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import AI Engines
from hao.engines.hidden_skill_engine import HiddenSkillEngine
from hao.engines.readiness_engine import ReadinessEngine
from hao.engines.recommendation_engine import RecommendationEngine
from hao.engines.explainability_engine import ExplainabilityEngine
from hao.engines.resume_rewriter_engine import ResumeRewriterEngine

# Import Validation Models
from hao.utils.validator import (
    HiddenSkillOutput,
    ReadinessScore,
    RecommendationOutput,
    ExplainabilityOutput,
    ResumeRewriterOutput
)

app = FastAPI(title="CareerOS AI API Service", docs_url="/api/docs", openapi_url="/api/openapi.json")

# Enable CORS for cross-origin frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate engines (Singleton pattern)
hidden_skill_engine = HiddenSkillEngine()
readiness_engine = ReadinessEngine()
recommendation_engine = RecommendationEngine()
explainability_engine = ExplainabilityEngine()
resume_rewriter_engine = ResumeRewriterEngine()

# Health check endpoint
@app.get("/api")
async def root():
    return {"status": "healthy", "message": "CareerOS AI API is running"}

# ─── Endpoint 1: Hidden Skill Extraction ───
class SkillExtractionRequest(BaseModel):
    text: str
    source_type: str = "resume"  # resume | project | assignment | syllabus

@app.post("/api/extract-skills", response_model=HiddenSkillOutput)
async def extract_skills(req: SkillExtractionRequest):
    try:
        result = await hidden_skill_engine.extract(text=req.text, source_type=req.source_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill extraction failed: {str(e)}")


# ─── Endpoint 2: Adaptive Readiness Scoring ───
class ReadinessEvaluationRequest(BaseModel):
    resume_text: str
    transcript_text: Optional[str] = None
    projects: List[str] = []
    competitions: List[str] = []
    workshops: List[str] = []
    certificates: List[str] = []
    github_summary: Optional[str] = None

@app.post("/api/evaluate-readiness", response_model=ReadinessScore)
async def evaluate_readiness(req: ReadinessEvaluationRequest):
    try:
        result = await readiness_engine.evaluate(
            resume_text=req.resume_text,
            transcript_text=req.transcript_text,
            projects=req.projects,
            competitions=req.competitions,
            workshops=req.workshops,
            certificates=req.certificates,
            github_summary=req.github_summary
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Readiness evaluation failed: {str(e)}")


# ─── Endpoint 3: Recommendation Engine ───
class RecommendationRequest(BaseModel):
    readiness_scores: ReadinessScore
    detected_skills: HiddenSkillOutput
    target_role: str

@app.post("/api/recommendations", response_model=RecommendationOutput)
async def get_recommendations(req: RecommendationRequest):
    try:
        result = await recommendation_engine.recommend(
            readiness_scores=req.readiness_scores,
            detected_skills=req.detected_skills,
            target_role=req.target_role
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendations failed: {str(e)}")


# ─── Endpoint 4: Explainability Engine ───
class ExplainabilityRequest(BaseModel):
    readiness_scores: ReadinessScore
    evidence: Dict[str, List[str]]
    student_name: Optional[str] = None

@app.post("/api/explain", response_model=ExplainabilityOutput)
async def get_explanation(req: ExplainabilityRequest):
    try:
        result = await explainability_engine.explain(
            readiness_scores=req.readiness_scores,
            evidence=req.evidence,
            student_name=req.student_name
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explainability failed: {str(e)}")


# ─── Endpoint 5: Resume Achievement Rewriter ───
class ResumeRewriteRequest(BaseModel):
    raw_bullets: List[str]
    target_role: Optional[str] = None

@app.post("/api/rewrite-resume", response_model=ResumeRewriterOutput)
async def rewrite_resume(req: ResumeRewriteRequest):
    try:
        result = await resume_rewriter_engine.rewrite(
            raw_bullets=req.raw_bullets,
            target_role=req.target_role
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume rewrite failed: {str(e)}")
```

#### 4. Vercel Configuration (`vercel.json`)
Create a file named `vercel.json` in the project root directory and add the routing configuration:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.py"
    }
  ]
}
```

#### 5. Local Run & Debug
Start the server locally from the root directory:
```bash
uvicorn api.index:app --host 0.0.0.0 --port 8000 --reload
```
Navigate to `http://localhost:8000/api/docs` to access the interactive Swagger API documentation.

---

### Step 2: Frontend Integration Guide

The frontend client accesses the server endpoints via standard HTTP REST calls. No Python environment is required.

**Production API Base URL (on Vercel):** `https://<your-vercel-domain>.vercel.app/api/...`

#### 1. Skill Extraction Integration Example
```javascript
// Local Development: 'http://localhost:8000/api/extract-skills'
// Vercel Deployment: 'https://<your-vercel-domain>.vercel.app/api/extract-skills'
const response = await fetch('http://localhost:8000/api/extract-skills', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Led a team of 4 to build an E-Commerce web app using React, Spring Boot and MySQL. Deployed to AWS EC2.",
    source_type: "project"
  })
});
const data = await response.json();
console.log(data.technical_skills); // Output: ["React", "Spring Boot", "MySQL", "AWS EC2"]
```

#### 2. Pipeline Chaining Example (Readiness Score & Action Recommendation)
```javascript
// Step 2.1: Get readiness scores
const readinessRes = await fetch('http://localhost:8000/api/evaluate-readiness', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resume_text: "Ahmad Faris... GPA: 3.72... Skills: Python, SQL...",
    projects: ["Student Grade Predictor using FastAPI"],
    workshops: ["AWS Cloud Practitioner Workshop"]
  })
});
const scores = await readinessRes.json();

// Step 2.2: Pass scores and detected skills to the recommendation engine
const recommendRes = await fetch('http://localhost:8000/api/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    readiness_scores: scores,
    detected_skills: {
      technical_skills: ["Python", "SQL", "FastAPI"],
      soft_skills: ["Teamwork"],
      mapped_roles: ["Backend Developer"]
    },
    target_role: "Data Scientist"
  })
});
const recommendations = await recommendRes.json();
console.log(recommendations.recommendations); // Array of recommended actions
```

---

### 💡 Hackathon Pro-Tips
1. **Mock-Data Driven UI**: Real-world responses are saved under `hao/data/mock_students.json` and `hao/outputs/sample_output.json`. Front-end development can proceed in parallel using these static JSON structures as mock payloads.
2. **API Key Setup**: Ensure that the `GROQ_API_KEY` and `OPENROUTER_API_KEY` are configured in the Vercel project settings prior to deployment.
