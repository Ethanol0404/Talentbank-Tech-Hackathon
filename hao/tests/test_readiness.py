"""
tests/test_readiness.py
────────────────────────
Unit tests for the Adaptive Readiness Engine.

Tests cover:
  - Score schema validation and range clamping
  - Correct prompt construction (multi-section profile)
  - Handling of optional fields (transcript, GitHub)
  - Score out-of-range coercion
  - Router delegation
"""

from __future__ import annotations

import json
import pytest
from unittest.mock import AsyncMock, MagicMock

from engines.readiness_engine import ReadinessEngine
from utils.validator import ReadinessScore


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture
def mock_router():
    router = MagicMock()
    router.last_used_provider = "groq"
    router.complete = AsyncMock()
    return router


VALID_SCORE_RESPONSE = json.dumps({
    "technical": 88,
    "communication": 70,
    "leadership": 72,
    "problem_solving": 85,
    "industry_exposure": 60,
    "overall_readiness": 79,
})

SAMPLE_RESUME = """
John Doe — Computer Science Student
Skills: Python, Java, SQL, Docker, Git
Projects: Built a web scraper, Developed a REST API for a university project
GPA: 3.65
"""


# ── Tests ─────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_evaluate_returns_readiness_score(mock_router):
    """Engine should return a valid ReadinessScore Pydantic model."""
    mock_router.complete.return_value = VALID_SCORE_RESPONSE

    engine = ReadinessEngine(router=mock_router)
    score = await engine.evaluate(resume_text=SAMPLE_RESUME)

    assert isinstance(score, ReadinessScore)
    assert score.technical == 88
    assert score.communication == 70
    assert score.overall_readiness == 79


@pytest.mark.asyncio
async def test_evaluate_scores_clamped_to_100(mock_router):
    """Scores exceeding 100 should be clamped to 100."""
    out_of_range_response = json.dumps({
        "technical": 150,       # Should be clamped to 100
        "communication": 70,
        "leadership": 72,
        "problem_solving": 85,
        "industry_exposure": -10,  # Should be clamped to 0
        "overall_readiness": 79,
    })
    mock_router.complete.return_value = out_of_range_response

    engine = ReadinessEngine(router=mock_router)
    score = await engine.evaluate(resume_text=SAMPLE_RESUME)

    assert score.technical == 100
    assert score.industry_exposure == 0


@pytest.mark.asyncio
async def test_evaluate_with_all_optional_fields(mock_router):
    """Engine should handle all optional fields without error."""
    mock_router.complete.return_value = VALID_SCORE_RESPONSE

    engine = ReadinessEngine(router=mock_router)
    score = await engine.evaluate(
        resume_text=SAMPLE_RESUME,
        transcript_text="CS101: A, CS102: A-, Data Structures: B+",
        projects=["Built a recommendation system using collaborative filtering"],
        competitions=["Won 2nd place in university hackathon"],
        workshops=["Completed AWS Cloud Practitioner workshop"],
        certificates=["AWS Certified Cloud Practitioner"],
        github_summary="50 repos, 300 contributions, primary: Python",
    )

    assert isinstance(score, ReadinessScore)
    # Verify all sections were included in the prompt
    call_kwargs = mock_router.complete.call_args.kwargs
    user_prompt = call_kwargs.get("user_prompt", "")
    assert "TRANSCRIPT" in user_prompt
    assert "PROJECTS" in user_prompt
    assert "COMPETITIONS" in user_prompt
    assert "WORKSHOPS" in user_prompt
    assert "CERTIFICATES" in user_prompt
    assert "GITHUB" in user_prompt


@pytest.mark.asyncio
async def test_evaluate_without_optional_fields(mock_router):
    """Engine should work with only the required resume_text."""
    mock_router.complete.return_value = VALID_SCORE_RESPONSE

    engine = ReadinessEngine(router=mock_router)
    score = await engine.evaluate(resume_text=SAMPLE_RESUME)

    assert isinstance(score, ReadinessScore)
    # Optional sections should not appear in prompt if not provided
    call_kwargs = mock_router.complete.call_args.kwargs
    user_prompt = call_kwargs.get("user_prompt", "")
    assert "TRANSCRIPT" not in user_prompt
    assert "GITHUB" not in user_prompt


@pytest.mark.asyncio
async def test_evaluate_prompt_contains_no_prediction_instruction(mock_router):
    """System prompt must instruct model NOT to predict — anti-forecast rule."""
    mock_router.complete.return_value = VALID_SCORE_RESPONSE

    engine = ReadinessEngine(router=mock_router)
    await engine.evaluate(resume_text=SAMPLE_RESUME)

    call_kwargs = mock_router.complete.call_args.kwargs
    system_prompt = call_kwargs.get("system_prompt", "")
    # Verify anti-forecast instruction is in the system prompt
    assert "NOT predict" in system_prompt or "not predict" in system_prompt.lower()


@pytest.mark.asyncio
async def test_evaluate_missing_required_field_raises(mock_router):
    """A response missing a required score field should raise a ValidationError."""
    from pydantic import ValidationError

    incomplete_response = json.dumps({
        "technical": 88,
        "communication": 70,
        # missing: leadership, problem_solving, industry_exposure, overall_readiness
    })
    mock_router.complete.return_value = incomplete_response

    engine = ReadinessEngine(router=mock_router)
    with pytest.raises(ValidationError):
        await engine.evaluate(resume_text=SAMPLE_RESUME)
