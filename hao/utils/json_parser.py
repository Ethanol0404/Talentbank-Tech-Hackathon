"""
utils/json_parser.py
────────────────────
Safe JSON extraction from raw LLM text responses.

LLMs sometimes wrap their JSON in markdown fences (```json ... ```) or add
preamble text. This module strips all of that and returns a clean Python dict.
"""

from __future__ import annotations

import json
import re
from typing import Any

from utils.logger import get_logger

logger = get_logger(__name__)


class JSONParseError(Exception):
    """Raised when a valid JSON object cannot be extracted from the LLM response."""


def extract_json(raw_text: str) -> dict[str, Any]:
    """
    Extract the first valid JSON object from a raw LLM response string.

    Strategy (applied in order):
      1. Parse the entire string directly as JSON.
      2. Strip markdown code fences (```json ... ``` or ``` ... ```) and retry.
      3. Find the first ``{`` … ``}`` block using balanced-brace scanning.

    Args:
        raw_text: The raw string returned by the LLM provider.

    Returns:
        A Python dict representing the parsed JSON object.

    Raises:
        JSONParseError: If no valid JSON object can be found after all attempts.
    """
    if not raw_text or not raw_text.strip():
        raise JSONParseError("LLM returned an empty response.")

    text = raw_text.strip()

    # ── Attempt 1: Direct parse ───────────────────────────────────────────────
    try:
        result = json.loads(text)
        if isinstance(result, dict):
            logger.debug("json_parser: direct parse succeeded")
            return result
    except json.JSONDecodeError:
        pass

    # ── Attempt 2: Strip markdown fences ─────────────────────────────────────
    fence_pattern = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.IGNORECASE)
    fenced_matches = fence_pattern.findall(text)
    for candidate in fenced_matches:
        try:
            result = json.loads(candidate.strip())
            if isinstance(result, dict):
                logger.debug("json_parser: fence-stripped parse succeeded")
                return result
        except json.JSONDecodeError:
            continue

    # ── Attempt 3: Balanced brace extraction ──────────────────────────────────
    json_candidate = _extract_brace_block(text)
    if json_candidate:
        try:
            result = json.loads(json_candidate)
            if isinstance(result, dict):
                logger.debug("json_parser: brace-block parse succeeded")
                return result
        except json.JSONDecodeError:
            pass

    logger.error("json_parser: all extraction strategies failed", raw_preview=text[:200])
    raise JSONParseError(
        f"Could not extract a valid JSON object from LLM response.\n"
        f"Preview: {text[:300]}"
    )


def _extract_brace_block(text: str) -> str | None:
    """
    Find the first balanced ``{ ... }`` block in *text*.

    Args:
        text: Arbitrary string that may contain a JSON object.

    Returns:
        The substring from the first ``{`` to its matching ``}`` (inclusive),
        or ``None`` if no balanced block is found.
    """
    start = text.find("{")
    if start == -1:
        return None

    depth = 0
    in_string = False
    escape_next = False

    for i, char in enumerate(text[start:], start=start):
        if escape_next:
            escape_next = False
            continue
        if char == "\\" and in_string:
            escape_next = True
            continue
        if char == '"' and not escape_next:
            in_string = not in_string
            continue
        if in_string:
            continue
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]

    return None


def safe_extract_json(raw_text: str, fallback: dict[str, Any] | None = None) -> dict[str, Any]:
    """
    Like ``extract_json`` but returns *fallback* instead of raising on failure.

    Args:
        raw_text: Raw LLM response text.
        fallback: Value to return if parsing fails.  Defaults to ``{}``.

    Returns:
        Parsed dict or the fallback value.
    """
    if fallback is None:
        fallback = {}
    try:
        return extract_json(raw_text)
    except JSONParseError as exc:
        logger.warning("json_parser: returning fallback", reason=str(exc))
        return fallback
