"""
providers/llm_router.py
───────────────────────
Automatic LLM routing with retry + fallback logic.

Flow:
  1. Try Groq (primary) up to `max_retries` times.
  2. On timeout, HTTP error, or quota exhaustion → immediately switch to OpenRouter.
  3. If OpenRouter also fails → raise LLMUnavailableError.

No manual switching required.  All routing is transparent to engine callers.
"""

from __future__ import annotations

import asyncio
from enum import Enum
from typing import Optional

from tenacity import (
    AsyncRetrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
    RetryError,
)

from providers.groq_provider import (
    GroqProvider,
    GroqTimeoutError,
    GroqQuotaError,
    GroqProviderError,
)
from providers.openrouter_provider import (
    OpenRouterProvider,
    OpenRouterTimeoutError,
    OpenRouterQuotaError,
    OpenRouterProviderError,
)
from config.settings import settings
from utils.logger import get_logger

logger = get_logger(__name__)


# ── Typed Exceptions ──────────────────────────────────────────────────────────

class LLMUnavailableError(Exception):
    """Raised when ALL providers have failed and no response could be obtained."""


# ── Active Provider Enum ──────────────────────────────────────────────────────

class ActiveProvider(str, Enum):
    GROQ = "groq"
    OPENROUTER = "openrouter"


# ── Router ────────────────────────────────────────────────────────────────────

class LLMRouter:
    """
    Intelligent LLM router that abstracts provider selection from callers.

    Engines call `router.complete(system_prompt, user_prompt)` and receive
    a text reply — the router handles all retry and fallback logic internally.

    Attributes:
        last_used_provider: Which provider actually served the last request.
    """

    # Error types that trigger an immediate fallback (no retry on same provider)
    _IMMEDIATE_FALLBACK_ERRORS = (GroqQuotaError,)

    # Error types where we retry the primary before falling back
    _RETRYABLE_ERRORS = (GroqTimeoutError, GroqProviderError)

    def __init__(self) -> None:
        self._groq = GroqProvider()
        self._openrouter = OpenRouterProvider()
        self._max_retries = settings.llm_max_retries
        self.last_used_provider: Optional[ActiveProvider] = None
        logger.info(
            "LLMRouter initialised",
            max_retries=self._max_retries,
            primary="groq",
            fallback="openrouter",
        )

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Obtain a completion, routing automatically between providers.

        Args:
            system_prompt: System instruction for the model.
            user_prompt:   User content / data payload.
            temperature:   Optional temperature override.
            max_tokens:    Optional max_tokens override.

        Returns:
            Raw text reply from whichever provider succeeded.

        Raises:
            LLMUnavailableError: If both Groq and OpenRouter fail.
        """
        # ── Step 1: Attempt Groq with retry ───────────────────────────────────
        groq_failure_reason: Optional[str] = None

        try:
            async for attempt in AsyncRetrying(
                retry=retry_if_exception_type(self._RETRYABLE_ERRORS),
                stop=stop_after_attempt(self._max_retries + 1),
                wait=wait_exponential(multiplier=1, min=1, max=8),
                reraise=True,
            ):
                with attempt:
                    logger.info(
                        "LLMRouter → Groq",
                        attempt_number=attempt.retry_state.attempt_number,
                    )
                    result = await self._groq.complete(
                        system_prompt, user_prompt, temperature, max_tokens
                    )
                    self.last_used_provider = ActiveProvider.GROQ
                    return result

        except GroqQuotaError as exc:
            groq_failure_reason = f"Groq quota exceeded: {exc}"
            logger.warning("LLMRouter: Groq quota exceeded — falling back immediately")

        except GroqTimeoutError as exc:
            groq_failure_reason = f"Groq timeout after retries: {exc}"
            logger.warning("LLMRouter: Groq timed out after retries — falling back")

        except GroqProviderError as exc:
            groq_failure_reason = f"Groq provider error after retries: {exc}"
            logger.warning("LLMRouter: Groq provider error after retries — falling back")

        except RetryError as exc:
            groq_failure_reason = f"Groq retry exhausted: {exc}"
            logger.warning("LLMRouter: Groq retries exhausted — falling back")

        # ── Step 2: Fallback to OpenRouter ────────────────────────────────────
        logger.info(
            "LLMRouter → OpenRouter (fallback)",
            reason=groq_failure_reason,
        )

        try:
            result = await self._openrouter.complete(
                system_prompt, user_prompt, temperature, max_tokens
            )
            self.last_used_provider = ActiveProvider.OPENROUTER
            logger.info("LLMRouter: OpenRouter responded successfully")
            return result

        except (OpenRouterTimeoutError, OpenRouterQuotaError, OpenRouterProviderError) as exc:
            logger.error(
                "LLMRouter: ALL providers failed",
                groq_reason=groq_failure_reason,
                openrouter_reason=str(exc),
            )
            raise LLMUnavailableError(
                f"All LLM providers unavailable.\n"
                f"  Groq: {groq_failure_reason}\n"
                f"  OpenRouter: {exc}"
            ) from exc
