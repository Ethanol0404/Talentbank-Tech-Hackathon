"""
tests/test_hidden_skill.py
───────────────────────────
Unit tests for the Hidden Skill Extractor engine.

Tests cover:
  - Successful extraction with mocked LLM response
  - Handling of empty/minimal text
  - JSON fence stripping
  - Missing field coercion (null → [])
  - Source type variations
"""

from __future__ import annotations

import json
import pytest
from unittest.mock import AsyncMock, MagicMock

from engines.hidden_skill_engine import HiddenSkillEngine
from utils.validator import HiddenSkillOutput


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture
def mock_router():
    """Create a mock LLMRouter that returns a configurable response."""
    router = MagicMock()
    router.last_used_provider = "groq"
    router.complete = AsyncMock()
    return router


SAMPLE_RESUME_TEXT = """
Python Developer with 2 years experience. Built REST APIs using FastAPI and Django.
Strong knowledge of PostgreSQL and Redis. Led a team of 4 engineers.
Experience with Docker, Kubernetes, and AWS. Presented at two internal tech talks.
Participated in company-wide hackathon. Good communicator and team player.
"""

EXPECTED_LLM_RESPONSE = json.dumps({
    "technical_skills": ["Python", "FastAPI", "Django", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
    "soft_skills": ["Team leadership", "Communication", "Teamwork"],
    "mapped_roles": ["Backend Software Engineer", "Python Developer", "Cloud Engineer"]
})


# ── Tests ─────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_extract_returns_correct_schema(mock_router):
    """Engine should return a valid HiddenSkillOutput from a clean LLM response."""
    mock_router.complete.return_value = EXPECTED_LLM_RESPONSE

    engine = HiddenSkillEngine(router=mock_router)
    result = await engine.extract(text=SAMPLE_RESUME_TEXT, source_type="resume")

    assert isinstance(result, HiddenSkillOutput)
    assert "Python" in result.technical_skills
    assert "FastAPI" in result.technical_skills
    assert "Team leadership" in result.soft_skills
    assert "Backend Software Engineer" in result.mapped_roles


@pytest.mark.asyncio
async def test_extract_with_markdown_fenced_response(mock_router):
    """Engine should strip markdown fences from LLM response correctly."""
    fenced_response = f"```json\n{EXPECTED_LLM_RESPONSE}\n```"
    mock_router.complete.return_value = fenced_response

    engine = HiddenSkillEngine(router=mock_router)
    result = await engine.extract(text=SAMPLE_RESUME_TEXT)

    assert "Python" in result.technical_skills


@pytest.mark.asyncio
async def test_extract_null_fields_coerced_to_empty_list(mock_router):
    """Null fields from the LLM should be coerced to empty lists by the validator."""
    response_with_nulls = json.dumps({
        "technical_skills": ["Python"],
        "soft_skills": None,
        "mapped_roles": None,
    })
    mock_router.complete.return_value = response_with_nulls

    engine = HiddenSkillEngine(router=mock_router)
    result = await engine.extract(text=SAMPLE_RESUME_TEXT)

    assert result.soft_skills == []
    assert result.mapped_roles == []
    assert "Python" in result.technical_skills


@pytest.mark.asyncio
async def test_extract_project_source_type(mock_router):
    """Engine should accept 'project' as source_type without error."""
    mock_router.complete.return_value = EXPECTED_LLM_RESPONSE

    engine = HiddenSkillEngine(router=mock_router)
    result = await engine.extract(
        text="Built a machine learning pipeline for image classification using PyTorch.",
        source_type="project",
    )

    # Verify that the user_prompt passed to router contains source type hint
    call_args = mock_router.complete.call_args
    assert "PROJECT" in call_args.kwargs.get("user_prompt", "") or \
           "PROJECT" in (call_args.args[1] if len(call_args.args) > 1 else "")


@pytest.mark.asyncio
async def test_extract_calls_router_with_correct_prompts(mock_router):
    """Router.complete should be called with system_prompt and user_prompt."""
    mock_router.complete.return_value = EXPECTED_LLM_RESPONSE

    engine = HiddenSkillEngine(router=mock_router)
    await engine.extract(text=SAMPLE_RESUME_TEXT, source_type="resume")

    mock_router.complete.assert_called_once()
    call_kwargs = mock_router.complete.call_args.kwargs
    assert "system_prompt" in call_kwargs
    assert "user_prompt" in call_kwargs
    # System prompt should contain key instruction keywords
    assert "JSON" in call_kwargs["system_prompt"]
    assert "RESUME" in call_kwargs["user_prompt"]


@pytest.mark.asyncio
async def test_extract_empty_response_raises_error(mock_router):
    """Engine should raise an error when LLM returns an empty string."""
    from utils.json_parser import JSONParseError

    mock_router.complete.return_value = ""

    engine = HiddenSkillEngine(router=mock_router)
    with pytest.raises(JSONParseError):
        await engine.extract(text=SAMPLE_RESUME_TEXT)


@pytest.mark.asyncio
async def test_extract_syllabus_source_type(mock_router):
    """Syllabus source type should be passed correctly in the prompt."""
    mock_router.complete.return_value = EXPECTED_LLM_RESPONSE
    syllabus_text = """
    CS301: Software Engineering
    Topics: Requirements Analysis, UML Design, Agile Methodologies,
    Design Patterns, Testing Strategies, Project Management.
    Students will work in teams to deliver a complete software system.
    """

    engine = HiddenSkillEngine(router=mock_router)
    result = await engine.extract(text=syllabus_text, source_type="syllabus")

    assert isinstance(result, HiddenSkillOutput)
    # Verify source type hint was in the user prompt
    call_kwargs = mock_router.complete.call_args.kwargs
    assert "SYLLABUS" in call_kwargs.get("user_prompt", "")
