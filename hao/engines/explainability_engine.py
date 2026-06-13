"""
engines/explainability_engine.py
──────────────────────────────────
Module 4: Explainability Engine (XAI)

Produces human-readable, evidence-grounded explanations for every readiness
score dimension. Follows Explainable AI principles:

  1. Transparency  — explains exactly why each score was assigned
  2. Fidelity      — explanations faithfully reflect the model's scoring
  3. Grounding     — every claim cites provided evidence
  4. Fairness      — no over/under-statement based on assumptions
  5. Actionability — improvement areas are specific enough to act on

CRITICAL: This engine NEVER hallucinate reasons. If evidence is absent for a
dimension, it states that explicitly rather than fabricating a justification.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from providers.llm_router import LLMRouter
from utils.json_parser import extract_json
from utils.validator import ExplainabilityInput, ExplainabilityOutput, ReadinessScore
from utils.logger import get_logger

logger = get_logger(__name__)

_PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "explainability_prompt.txt"
_SYSTEM_PROMPT: str = _PROMPT_PATH.read_text(encoding="utf-8")


class ExplainabilityEngine:
    """
    Explainability Engine (XAI).

    Translates numerical readiness scores into human-readable narratives that
    a student can act on. Every explanation is anchored to concrete evidence.

    Usage:
        engine = ExplainabilityEngine()
        output = await engine.explain(
            readiness_scores=scores,
            evidence={
                "technical": ["Python", "FastAPI", "two data science projects"],
                "leadership": ["President of Computer Science Club"],
            },
            student_name="Ahmad",
        )
    """

    def __init__(self, router: LLMRouter | None = None) -> None:
        self._router = router or LLMRouter()

    async def explain(
        self,
        readiness_scores: ReadinessScore,
        evidence: Optional[dict[str, list[str]]] = None,
        student_name: Optional[str] = None,
    ) -> ExplainabilityOutput:
        """
        Generate XAI explanations for the readiness scores.

        Args:
            readiness_scores: Validated readiness score object.
            evidence:         Dict mapping dimension names to evidence lists.
                              Example: {"technical": ["Python", "React"]}
            student_name:     Optional name for personalised language.

        Returns:
            ExplainabilityOutput with summary, dimension_explanations,
            strengths, and improvement_areas.

        Raises:
            ValidationError:     If LLM output cannot be coerced.
            LLMUnavailableError: If all providers fail.
        """
        payload = ExplainabilityInput(
            readiness_scores=readiness_scores,
            evidence=evidence or {},
            student_name=student_name,
        )

        user_prompt = self._build_user_prompt(payload)

        logger.info(
            "ExplainabilityEngine: generating explanations",
            has_student_name=student_name is not None,
            evidence_dimensions=list((evidence or {}).keys()),
        )

        raw_response = await self._router.complete(
            system_prompt=_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        logger.debug(
            "ExplainabilityEngine: LLM responded",
            provider=self._router.last_used_provider,
        )

        parsed = extract_json(raw_response)
        output = ExplainabilityOutput(**parsed)

        logger.info(
            "ExplainabilityEngine: complete",
            strengths_count=len(output.strengths),
            improvement_areas_count=len(output.improvement_areas),
        )

        return output

    @staticmethod
    def _build_user_prompt(payload: ExplainabilityInput) -> str:
        """
        Construct the XAI prompt from scores, evidence, and optional name.
        """
        scores = payload.readiness_scores
        name_str = f"Student: {payload.student_name}" if payload.student_name else "Student: (anonymous)"

        lines: list[str] = [
            name_str,
            "",
            "READINESS SCORES TO EXPLAIN:",
            f"  Technical:          {scores.technical}/100",
            f"  Communication:      {scores.communication}/100",
            f"  Leadership:         {scores.leadership}/100",
            f"  Problem Solving:    {scores.problem_solving}/100",
            f"  Industry Exposure:  {scores.industry_exposure}/100",
            f"  Overall Readiness:  {scores.overall_readiness}/100",
            "",
            "EVIDENCE USED TO ASSIGN THESE SCORES:",
        ]

        dimensions = [
            "technical", "communication", "leadership",
            "problem_solving", "industry_exposure",
        ]

        for dim in dimensions:
            evidence_items = payload.evidence.get(dim, [])
            if evidence_items:
                lines.append(f"  [{dim.upper()}]")
                for item in evidence_items:
                    lines.append(f"    - {item}")
            else:
                lines.append(f"  [{dim.upper()}]: No specific evidence provided")

        lines.extend([
            "",
            "=" * 60,
            "Generate a human-readable explanation grounded in the above evidence.",
            "Every claim must cite the evidence listed above.",
            "Return a single JSON object.",
        ])

        return "\n".join(lines)
