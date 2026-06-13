"""
engines/hidden_skill_engine.py
───────────────────────────────
Module 1: Hidden Skill Extractor

Extracts employability skills from:
  - Resumes
  - Project descriptions
  - Assignments
  - Course syllabi

Returns a validated JSON structure containing:
  - technical_skills
  - soft_skills
  - mapped_roles
"""

from __future__ import annotations

import json
from pathlib import Path

from providers.llm_router import LLMRouter
from utils.json_parser import extract_json
from utils.validator import HiddenSkillInput, HiddenSkillOutput
from utils.logger import get_logger

logger = get_logger(__name__)

# Load prompt template once at module import
_PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "hidden_skill_prompt.txt"
_SYSTEM_PROMPT: str = _PROMPT_PATH.read_text(encoding="utf-8")


class HiddenSkillEngine:
    """
    Extracts hidden employability skills from unstructured text.

    The engine is stateless — a single instance can serve multiple requests.
    It delegates LLM routing to LLMRouter (Groq primary / OpenRouter fallback).

    Usage:
        engine = HiddenSkillEngine()
        output = await engine.extract(text="...", source_type="resume")
    """

    def __init__(self, router: LLMRouter | None = None) -> None:
        """
        Initialise the engine.

        Args:
            router: Optional pre-built LLMRouter instance (useful for testing).
                    If None, a new router is created automatically.
        """
        self._router = router or LLMRouter()

    async def extract(
        self,
        text: str,
        source_type: str = "resume",
    ) -> HiddenSkillOutput:
        """
        Extract skills from the provided text.

        Args:
            text:        Raw text to analyse (resume, project desc, syllabus, etc.).
            source_type: Hint about the source: 'resume' | 'project' | 'assignment' | 'syllabus'.

        Returns:
            HiddenSkillOutput with technical_skills, soft_skills, and mapped_roles.

        Raises:
            ValidationError: If the LLM output cannot be coerced into the expected schema.
            LLMUnavailableError: If all LLM providers fail.
        """
        # Validate input
        payload = HiddenSkillInput(text=text, source_type=source_type)

        # Build user prompt
        user_prompt = self._build_user_prompt(payload)

        logger.info(
            "HiddenSkillEngine: extracting skills",
            source_type=source_type,
            text_chars=len(text),
        )

        # Call LLM via router (handles Groq → OpenRouter fallback automatically)
        raw_response = await self._router.complete(
            system_prompt=_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        logger.debug(
            "HiddenSkillEngine: LLM responded",
            provider=self._router.last_used_provider,
            response_chars=len(raw_response),
        )

        # Parse and validate response
        parsed = extract_json(raw_response)
        output = HiddenSkillOutput(**parsed)

        logger.info(
            "HiddenSkillEngine: extraction complete",
            technical_count=len(output.technical_skills),
            soft_count=len(output.soft_skills),
            roles_count=len(output.mapped_roles),
        )

        return output

    @staticmethod
    def _build_user_prompt(payload: HiddenSkillInput) -> str:
        """
        Construct the user-side prompt from validated input.

        Args:
            payload: Validated HiddenSkillInput.

        Returns:
            Formatted user prompt string.
        """
        return (
            f"SOURCE TYPE: {payload.source_type.upper()}\n\n"
            f"TEXT TO ANALYSE:\n"
            f"{'─' * 60}\n"
            f"{payload.text.strip()}\n"
            f"{'─' * 60}\n\n"
            f"Extract all skills from the above text and return a single JSON object."
        )
