"""
tests/test_recommendation.py
──────────────────────────────
Unit tests for the Recommendation Engine.

Tests cover:
  - Valid recommendation output schema
  - Recommendations linked to missing skills (not arbitrary)
  - Priority level validation
  - Correct prompt includes scores + skills + target role
  - Handling of LLM returning simplified string recommendations
"""

from __future__ import annotations

import json
import pytest
from unittest.mock import AsyncMock, MagicMock

from engines.recommendation_engine import RecommendationEngine
from utils.validator import ReadinessScore, HiddenSkillOutput, RecommendationOutput


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture
def mock_router():
    router = MagicMock()
    router.last_used_provider = "groq"
    router.complete = AsyncMock()
    return router


@pytest.fixture
def sample_readiness_score():
    return ReadinessScore(
        technical=88,
        communication=70,
        leadership=72,
        problem_solving=85,
        industry_exposure=55,
        overall_readiness=79,
    )


@pytest.fixture
def sample_detected_skills():
    return HiddenSkillOutput(
        technical_skills=["Python", "Scikit-learn", "FastAPI", "SQL"],
        soft_skills=["Leadership", "Communication"],
        mapped_roles=["Data Scientist", "ML Engineer"],
    )


VALID_RECOMMENDATION_RESPONSE = json.dumps({
    "missing_skills": [
        "MLOps",
        "Apache Spark",
        "AWS SageMaker"
    ],
    "recommendations": [
        {
            "action": "Complete AWS Machine Learning Specialty certification",
            "rationale": "Directly addresses gap in cloud-based ML deployment required for Data Scientist roles",
            "priority": "high"
        },
        {
            "action": "Build an MLOps pipeline using MLflow and Docker",
            "rationale": "MLOps is identified as a critical missing skill for production ML work",
            "priority": "high"
        },
        {
            "action": "Complete an Apache Spark course on Databricks",
            "rationale": "Big data processing skills are required for Data Scientist roles handling large datasets",
            "priority": "medium"
        }
    ]
})


# ── Tests ─────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_recommend_returns_valid_output(mock_router, sample_readiness_score, sample_detected_skills):
    """Engine should return a valid RecommendationOutput."""
    mock_router.complete.return_value = VALID_RECOMMENDATION_RESPONSE

    engine = RecommendationEngine(router=mock_router)
    result = await engine.recommend(
        readiness_scores=sample_readiness_score,
        detected_skills=sample_detected_skills,
        target_role="Data Scientist",
    )

    assert isinstance(result, RecommendationOutput)
    assert len(result.missing_skills) == 3
    assert len(result.recommendations) == 3
    assert "MLOps" in result.missing_skills


@pytest.mark.asyncio
async def test_recommend_recommendation_items_have_required_fields(
    mock_router, sample_readiness_score, sample_detected_skills
):
    """Each recommendation item should have action, rationale, and priority."""
    mock_router.complete.return_value = VALID_RECOMMENDATION_RESPONSE

    engine = RecommendationEngine(router=mock_router)
    result = await engine.recommend(
        readiness_scores=sample_readiness_score,
        detected_skills=sample_detected_skills,
        target_role="Data Scientist",
    )

    for rec in result.recommendations:
        assert rec.action
        assert rec.rationale
        assert rec.priority in ("high", "medium", "low")


@pytest.mark.asyncio
async def test_recommend_prompt_includes_target_role(
    mock_router, sample_readiness_score, sample_detected_skills
):
    """The user prompt must include the target role."""
    mock_router.complete.return_value = VALID_RECOMMENDATION_RESPONSE

    engine = RecommendationEngine(router=mock_router)
    await engine.recommend(
        readiness_scores=sample_readiness_score,
        detected_skills=sample_detected_skills,
        target_role="Data Scientist",
    )

    call_kwargs = mock_router.complete.call_args.kwargs
    user_prompt = call_kwargs.get("user_prompt", "")
    assert "Data Scientist" in user_prompt


@pytest.mark.asyncio
async def test_recommend_prompt_includes_readiness_scores(
    mock_router, sample_readiness_score, sample_detected_skills
):
    """The user prompt must include all readiness scores."""
    mock_router.complete.return_value = VALID_RECOMMENDATION_RESPONSE

    engine = RecommendationEngine(router=mock_router)
    await engine.recommend(
        readiness_scores=sample_readiness_score,
        detected_skills=sample_detected_skills,
        target_role="Data Scientist",
    )

    call_kwargs = mock_router.complete.call_args.kwargs
    user_prompt = call_kwargs.get("user_prompt", "")
    assert "88" in user_prompt    # technical score
    assert "55" in user_prompt    # industry_exposure score


@pytest.mark.asyncio
async def test_recommend_accepts_string_recommendations(
    mock_router, sample_readiness_score, sample_detected_skills
):
    """
    Validator should gracefully handle LLM returning recommendations as strings
    rather than objects (coerces to RecommendationItem with empty rationale).
    """
    simple_response = json.dumps({
        "missing_skills": ["MLOps"],
        "recommendations": [
            "Attend a cloud ML workshop",
            "Complete Kaggle competition"
        ]
    })
    mock_router.complete.return_value = simple_response

    engine = RecommendationEngine(router=mock_router)
    result = await engine.recommend(
        readiness_scores=sample_readiness_score,
        detected_skills=sample_detected_skills,
        target_role="Data Scientist",
    )

    assert len(result.recommendations) == 2
    assert result.recommendations[0].action == "Attend a cloud ML workshop"


@pytest.mark.asyncio
async def test_recommend_null_missing_skills_returns_empty_list(
    mock_router, sample_readiness_score, sample_detected_skills
):
    """Null missing_skills from LLM should coerce to empty list."""
    response = json.dumps({
        "missing_skills": None,
        "recommendations": []
    })
    mock_router.complete.return_value = response

    engine = RecommendationEngine(router=mock_router)
    result = await engine.recommend(
        readiness_scores=sample_readiness_score,
        detected_skills=sample_detected_skills,
        target_role="Data Scientist",
    )

    assert result.missing_skills == []
