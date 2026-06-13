# api/index.py
import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict

# Ensure Vercel can locate the 'hao' module and its subfolders in the root directory
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, "hao"))

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

app = FastAPI(title="UniOS AI API Service", docs_url="/api/docs", openapi_url="/api/openapi.json")

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
    return {"status": "healthy", "message": "UniOS AI API is running"}

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
