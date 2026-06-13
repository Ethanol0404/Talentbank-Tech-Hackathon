"""
engines/readiness_engine.py
────────────────────────────
Module 2: Adaptive Readiness Engine

Evaluates a student's CURRENT workplace readiness across six dimensions:
  - technical
  - communication
  - leadership
  - problem_solving
  - industry_exposure
  - overall_readiness (weighted average)

IMPORTANT:
  - Does NOT predict future performance.
  - Does NOT forecast career potential.
  - Only evaluates current, demonstrated capability based on provided evidence.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from providers.llm_router import LLMRouter
from utils.json_parser import extract_json
from utils.validator import ReadinessInput, ReadinessScore
from utils.logger import get_logger

logger = get_logger(__name__)

_PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "readiness_prompt.txt"
_SYSTEM_PROMPT: str = _PROMPT_PATH.read_text(encoding="utf-8")


class ReadinessEngine:
    """
    Adaptive Readiness Engine.

    Scores workplace readiness purely from evidence supplied in the student profile.
    Returns a validated ReadinessScore Pydantic model.

    Usage:
        engine = ReadinessEngine()
        score = await engine.evaluate(
            resume_text="...",
            projects=["Built a web scraper..."],
            workshops=["Attended AWS Cloud Practitioner workshop"],
        )
    """

    def __init__(self, router: LLMRouter | None = None) -> None:
        self._router = router or LLMRouter()

    async def evaluate(
        self,
        resume_text: str,
        transcript_text: Optional[str] = None,
        projects: Optional[list[str]] = None,
        competitions: Optional[list[str]] = None,
        workshops: Optional[list[str]] = None,
        certificates: Optional[list[str]] = None,
        github_summary: Optional[str] = None,
    ) -> ReadinessScore:
        """
        Evaluate the student's current workplace readiness.

        Args:
            resume_text:      Full text of the student's resume (required).
            transcript_text:  Academic transcript text (optional).
            projects:         List of project description strings.
            competitions:     List of competition participation records.
            workshops:        List of workshop/training records.
            certificates:     List of certificate names/descriptions.
            github_summary:   Summary of GitHub activity (optional).

        Returns:
            ReadinessScore with scores for all six dimensions.

        Raises:
            ValidationError:     If LLM output is malformed.
            LLMUnavailableError: If all providers fail.
        """
        # Build and validate input payload
        payload = ReadinessInput(
            resume_text=resume_text,
            transcript_text=transcript_text,
            projects=projects or [],
            competitions=competitions or [],
            workshops=workshops or [],
            certificates=certificates or [],
            github_summary=github_summary,
        )

        user_prompt = self._build_user_prompt(payload)

        logger.info(
            "ReadinessEngine: evaluating readiness",
            has_transcript=transcript_text is not None,
            project_count=len(payload.projects),
            competition_count=len(payload.competitions),
        )

        raw_response = await self._router.complete(
            system_prompt=_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        logger.debug(
            "ReadinessEngine: LLM responded",
            provider=self._router.last_used_provider,
        )

        parsed = extract_json(raw_response)
        score = ReadinessScore(**parsed)

        logger.info(
            "ReadinessEngine: evaluation complete",
            overall_readiness=score.overall_readiness,
            technical=score.technical,
        )

        return score

    @staticmethod
    def _build_user_prompt(payload: ReadinessInput) -> str:
        """
        Construct the evaluation prompt from the student's profile data.
        """
        sections: list[str] = []

        sections.append("STUDENT PROFILE FOR READINESS EVALUATION")
        sections.append("=" * 60)

        sections.append("\n[RESUME]\n" + payload.resume_text.strip())

        if payload.transcript_text:
            sections.append("\n[ACADEMIC TRANSCRIPT]\n" + payload.transcript_text.strip())

        if payload.projects:
            sections.append("\n[PROJECTS]")
            for i, proj in enumerate(payload.projects, 1):
                sections.append(f"  {i}. {proj.strip()}")

        if payload.competitions:
            sections.append("\n[COMPETITIONS & HACKATHONS]")
            for i, comp in enumerate(payload.competitions, 1):
                sections.append(f"  {i}. {comp.strip()}")

        if payload.workshops:
            sections.append("\n[WORKSHOPS & TRAINING]")
            for i, ws in enumerate(payload.workshops, 1):
                sections.append(f"  {i}. {ws.strip()}")

        if payload.certificates:
            sections.append("\n[CERTIFICATES]")
            for i, cert in enumerate(payload.certificates, 1):
                sections.append(f"  {i}. {cert.strip()}")

        if payload.github_summary:
            sections.append("\n[GITHUB SUMMARY]\n" + payload.github_summary.strip())

        sections.append("\n" + "=" * 60)
        sections.append(
            "Based ONLY on the above evidence, return a JSON readiness score object. "
            "Do NOT predict future potential. Score current demonstrated capability only."
        )

        return "\n".join(sections)
