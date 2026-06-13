"""
utils/validator.py
──────────────────
Pydantic models and validation helpers for all engine I/O schemas.

Each engine's input and output is defined as a Pydantic model here,
providing:
  - Type safety and coercion
  - Automatic field validation
  - Clear, self-documenting API contracts
  - Easy serialisation to / from JSON
"""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field, field_validator, model_validator


# ═══════════════════════════════════════════════════════════════════════════════
# Module 1 — Hidden Skill Extractor
# ═══════════════════════════════════════════════════════════════════════════════

class HiddenSkillInput(BaseModel):
    """Input payload for the Hidden Skill Extractor engine."""

    text: str = Field(
        ...,
        min_length=10,
        description="Raw text: resume, project description, assignment, or syllabus.",
    )
    source_type: str = Field(
        default="resume",
        description="Origin of the text: 'resume' | 'project' | 'assignment' | 'syllabus'.",
    )


class HiddenSkillOutput(BaseModel):
    """Validated output from the Hidden Skill Extractor engine."""

    technical_skills: list[str] = Field(
        default_factory=list,
        description="Detected technical / hard skills.",
    )
    soft_skills: list[str] = Field(
        default_factory=list,
        description="Detected soft / interpersonal skills.",
    )
    mapped_roles: list[str] = Field(
        default_factory=list,
        description="Job roles the detected skills map to.",
    )

    @field_validator("technical_skills", "soft_skills", "mapped_roles", mode="before")
    @classmethod
    def ensure_list(cls, v: object) -> list:
        """Coerce None → [] to handle LLM returning null for empty fields."""
        if v is None:
            return []
        return v


# ═══════════════════════════════════════════════════════════════════════════════
# Module 2 — Adaptive Readiness Engine
# ═══════════════════════════════════════════════════════════════════════════════

class ReadinessInput(BaseModel):
    """Input payload for the Adaptive Readiness Engine."""

    resume_text: str = Field(..., description="Full resume text.")
    transcript_text: Optional[str] = Field(None, description="Academic transcript (optional).")
    projects: list[str] = Field(default_factory=list, description="Project descriptions.")
    competitions: list[str] = Field(default_factory=list, description="Competition participation records.")
    workshops: list[str] = Field(default_factory=list, description="Workshop or training records.")
    certificates: list[str] = Field(default_factory=list, description="Certificates obtained.")
    github_summary: Optional[str] = Field(None, description="GitHub activity summary (optional).")


class ReadinessScore(BaseModel):
    """Validated readiness scores (0–100 per dimension)."""

    technical: int = Field(..., ge=0, le=100)
    communication: int = Field(..., ge=0, le=100)
    leadership: int = Field(..., ge=0, le=100)
    problem_solving: int = Field(..., ge=0, le=100)
    industry_exposure: int = Field(..., ge=0, le=100)
    overall_readiness: int = Field(..., ge=0, le=100)

    @model_validator(mode="before")
    @classmethod
    def coerce_scores(cls, values: dict) -> dict:
        """Clamp any out-of-range integers returned by the LLM to [0, 100]."""
        for key in ("technical", "communication", "leadership",
                    "problem_solving", "industry_exposure", "overall_readiness"):
            if key in values and isinstance(values[key], (int, float)):
                values[key] = max(0, min(100, int(values[key])))
        return values


# ═══════════════════════════════════════════════════════════════════════════════
# Module 3 — Recommendation Engine
# ═══════════════════════════════════════════════════════════════════════════════

class RecommendationInput(BaseModel):
    """Input payload for the Recommendation Engine."""

    readiness_scores: ReadinessScore
    target_role: str = Field(..., description="The job role the student is targeting.")
    detected_skills: HiddenSkillOutput


class RecommendationItem(BaseModel):
    """A single actionable recommendation."""

    action: str = Field(..., description="What the student should do.")
    rationale: str = Field(..., description="Why this action addresses the gap.")
    priority: str = Field(
        default="medium",
        description="Urgency: 'high' | 'medium' | 'low'.",
    )


class RecommendationOutput(BaseModel):
    """Validated output from the Recommendation Engine."""

    missing_skills: list[str] = Field(default_factory=list)
    recommendations: list[RecommendationItem] = Field(default_factory=list)

    @field_validator("missing_skills", mode="before")
    @classmethod
    def ensure_list(cls, v: object) -> list:
        return [] if v is None else v

    @field_validator("recommendations", mode="before")
    @classmethod
    def coerce_recommendations(cls, v: object) -> list:
        """Accept list of dicts from the LLM and coerce to RecommendationItem."""
        if v is None:
            return []
        if isinstance(v, list):
            result = []
            for item in v:
                if isinstance(item, str):
                    result.append({"action": item, "rationale": "", "priority": "medium"})
                elif isinstance(item, dict):
                    result.append(item)
            return result
        return []


# ═══════════════════════════════════════════════════════════════════════════════
# Module 4 — Explainability Engine
# ═══════════════════════════════════════════════════════════════════════════════

class ExplainabilityInput(BaseModel):
    """Input payload for the Explainability Engine."""

    readiness_scores: ReadinessScore
    evidence: dict[str, list[str]] = Field(
        default_factory=dict,
        description="Evidence items per dimension, e.g. {'technical': ['Python', 'FastAPI']}",
    )
    student_name: Optional[str] = Field(None, description="Optional student name for personalisation.")


class ExplainabilityOutput(BaseModel):
    """Validated output from the Explainability Engine."""

    summary: str = Field(..., description="Overall narrative of the readiness profile.")
    dimension_explanations: dict[str, str] = Field(
        default_factory=dict,
        description="Per-dimension explanation strings.",
    )
    strengths: list[str] = Field(default_factory=list)
    improvement_areas: list[str] = Field(default_factory=list)


# ═══════════════════════════════════════════════════════════════════════════════
# Module 5 — Resume Achievement Rewriter
# ═══════════════════════════════════════════════════════════════════════════════

class ResumeRewriterInput(BaseModel):
    """Input payload for the Resume Achievement Rewriter."""

    raw_bullets: list[str] = Field(
        ...,
        min_length=1,
        description="Original resume bullet points or descriptions to rewrite.",
    )
    target_role: Optional[str] = Field(
        None,
        description="Target job role for ATS keyword alignment.",
    )


class ResumeRewriterOutput(BaseModel):
    """Validated output from the Resume Achievement Rewriter."""

    rewritten_bullets: list[str] = Field(
        default_factory=list,
        description="ATS-optimised resume bullet points.",
    )

    @field_validator("rewritten_bullets", mode="before")
    @classmethod
    def ensure_list(cls, v: object) -> list:
        return [] if v is None else v
