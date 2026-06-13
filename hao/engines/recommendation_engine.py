"""
engines/recommendation_engine.py
──────────────────────────────────
Module 3: Recommendation Engine

Given a student's detected skills and readiness scores, identifies gaps
relative to a target role and provides concrete, actionable recommendations.

Recommendations are ALWAYS directly linked to identified missing skills.
No generic advice is generated.
"""

from __future__ import annotations

import json
from pathlib import Path

from providers.llm_router import LLMRouter
from utils.json_parser import extract_json
from utils.validator import (
    RecommendationInput,
    RecommendationOutput,
    ReadinessScore,
    HiddenSkillOutput,
)
from utils.logger import get_logger

logger = get_logger(__name__)

_PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "recommendation_prompt.txt"
_SYSTEM_PROMPT: str = _PROMPT_PATH.read_text(encoding="utf-8")


class RecommendationEngine:
    """
    Recommendation Engine.

    Accepts a student's readiness scores and detected skills, plus a target role,
    and returns a list of missing skills and prioritised, actionable recommendations.

    Usage:
        engine = RecommendationEngine()
        output = await engine.recommend(
            readiness_scores=score,
            detected_skills=skills,
            target_role="Data Scientist",
        )
    """

    def __init__(self, router: LLMRouter | None = None) -> None:
        self._router = router or LLMRouter()

    async def recommend(
        self,
        readiness_scores: ReadinessScore,
        detected_skills: HiddenSkillOutput,
        target_role: str,
    ) -> RecommendationOutput:
        """
        Generate recommendations to close capability gaps for the target role.

        Args:
            readiness_scores: The student's current readiness scores.
            detected_skills:  Skills already detected from the student's profile.
            target_role:      The role the student wants to qualify for.

        Returns:
            RecommendationOutput with missing_skills and recommendations.

        Raises:
            ValidationError:     If LLM output cannot be coerced into schema.
            LLMUnavailableError: If all providers fail.
        """
        payload = RecommendationInput(
            readiness_scores=readiness_scores,
            target_role=target_role,
            detected_skills=detected_skills,
        )

        user_prompt = self._build_user_prompt(payload)

        logger.info(
            "RecommendationEngine: generating recommendations",
            target_role=target_role,
            known_technical=len(detected_skills.technical_skills),
        )

        raw_response = await self._router.complete(
            system_prompt=_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        logger.debug(
            "RecommendationEngine: LLM responded",
            provider=self._router.last_used_provider,
        )

        parsed = extract_json(raw_response)
        output = RecommendationOutput(**parsed)

        logger.info(
            "RecommendationEngine: complete",
            missing_skills_count=len(output.missing_skills),
            recommendation_count=len(output.recommendations),
        )

        return output

    @staticmethod
    def _build_user_prompt(payload: RecommendationInput) -> str:
        """
        Build the user-side recommendation prompt.
        """
        scores = payload.readiness_scores
        skills = payload.detected_skills

        lines: list[str] = [
            f"TARGET ROLE: {payload.target_role}",
            "",
            "CURRENT READINESS SCORES:",
            f"  - Technical:          {scores.technical}/100",
            f"  - Communication:      {scores.communication}/100",
            f"  - Leadership:         {scores.leadership}/100",
            f"  - Problem Solving:    {scores.problem_solving}/100",
            f"  - Industry Exposure:  {scores.industry_exposure}/100",
            f"  - Overall Readiness:  {scores.overall_readiness}/100",
            "",
            "DETECTED TECHNICAL SKILLS:",
            "  " + (", ".join(skills.technical_skills) if skills.technical_skills else "None detected"),
            "",
            "DETECTED SOFT SKILLS:",
            "  " + (", ".join(skills.soft_skills) if skills.soft_skills else "None detected"),
            "",
            "=" * 60,
            f"Analyse the gap between the student's current profile and the '{payload.target_role}' role.",
            "Identify missing skills and return concrete, actionable recommendations.",
            "Return a single JSON object.",
        ]

        return "\n".join(lines)
