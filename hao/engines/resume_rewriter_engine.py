"""
engines/resume_rewriter_engine.py
───────────────────────────────────
Module 5: Resume Achievement Rewriter

Converts academic-style resume descriptions into ATS-optimised bullet points.

Key constraints:
  - Starts every bullet with a strong action verb
  - NEVER invents metrics, numbers, or achievements
  - NEVER fabricates skills or tools not in the original text
  - Uses professional, industry-standard language
  - Removes filler words ("helped", "assisted with", "worked on")
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from providers.llm_router import LLMRouter
from utils.json_parser import extract_json
from utils.validator import ResumeRewriterInput, ResumeRewriterOutput
from utils.logger import get_logger

logger = get_logger(__name__)

_PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "resume_rewriter_prompt.txt"
_SYSTEM_PROMPT: str = _PROMPT_PATH.read_text(encoding="utf-8")


class ResumeRewriterEngine:
    """
    Resume Achievement Rewriter Engine.

    Transforms weak, academic, or informal resume bullet points into
    strong, ATS-optimised professional bullets.

    Usage:
        engine = ResumeRewriterEngine()
        output = await engine.rewrite(
            raw_bullets=[
                "helped build a web app for university project",
                "was involved in data analysis using python",
            ],
            target_role="Software Engineer",
        )
    """

    def __init__(self, router: LLMRouter | None = None) -> None:
        self._router = router or LLMRouter()

    async def rewrite(
        self,
        raw_bullets: list[str],
        target_role: Optional[str] = None,
    ) -> ResumeRewriterOutput:
        """
        Rewrite raw resume bullet points into professional ATS-optimised bullets.

        Args:
            raw_bullets:  List of original resume descriptions or bullets.
            target_role:  Target job role for keyword alignment (optional).

        Returns:
            ResumeRewriterOutput with a list of rewritten_bullets.

        Raises:
            ValidationError:     If LLM output cannot be coerced.
            LLMUnavailableError: If all providers fail.
        """
        payload = ResumeRewriterInput(raw_bullets=raw_bullets, target_role=target_role)

        user_prompt = self._build_user_prompt(payload)

        logger.info(
            "ResumeRewriterEngine: rewriting bullets",
            bullet_count=len(raw_bullets),
            target_role=target_role or "not specified",
        )

        raw_response = await self._router.complete(
            system_prompt=_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        logger.debug(
            "ResumeRewriterEngine: LLM responded",
            provider=self._router.last_used_provider,
        )

        parsed = extract_json(raw_response)
        output = ResumeRewriterOutput(**parsed)

        logger.info(
            "ResumeRewriterEngine: complete",
            input_count=len(raw_bullets),
            output_count=len(output.rewritten_bullets),
        )

        return output

    @staticmethod
    def _build_user_prompt(payload: ResumeRewriterInput) -> str:
        """
        Construct the rewriter prompt with numbered original bullets.
        """
        lines: list[str] = []

        if payload.target_role:
            lines.append(f"TARGET ROLE: {payload.target_role}")
            lines.append("")

        lines.append(
            "ORIGINAL RESUME BULLETS TO REWRITE "
            "(rewrite each one in order, maintaining the same count):"
        )
        lines.append("=" * 60)

        for i, bullet in enumerate(payload.raw_bullets, 1):
            lines.append(f"{i}. {bullet.strip()}")

        lines.extend([
            "=" * 60,
            "",
            "Rules:",
            "- Rewrite each bullet to start with a strong action verb.",
            "- Do NOT invent any metrics or achievements not in the original.",
            "- Do NOT add skills or tools not mentioned in the original.",
            "- Return a JSON object with a 'rewritten_bullets' array.",
            f"- The array must contain exactly {len(payload.raw_bullets)} items.",
        ])

        return "\n".join(lines)
