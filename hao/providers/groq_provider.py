"""
providers/groq_provider.py
──────────────────────────
Primary LLM provider: Groq API using Llama 3 70B.

Responsibilities:
  - Build and send chat completion requests to the Groq API.
  - Enforce timeout on every call.
  - Classify response errors so the router can decide to retry or fall back.
  - Return a plain string (the model's reply) or raise a typed exception.
"""

from __future__ import annotations

import asyncio
from typing import Optional

import groq
from groq import AsyncGroq

from config.settings import settings
from config.model_config import GROQ_CONFIG
from utils.logger import get_logger

logger = get_logger(__name__)


# ── Typed Exceptions ──────────────────────────────────────────────────────────

class GroqTimeoutError(Exception):
    """Raised when the Groq call exceeds the configured timeout."""


class GroqQuotaError(Exception):
    """Raised when Groq returns HTTP 429 (rate-limit / quota exceeded)."""


class GroqProviderError(Exception):
    """Raised for any other Groq API error (5xx, malformed response, etc.)."""


# ── Provider Class ────────────────────────────────────────────────────────────

class GroqProvider:
    """
    Thin, async wrapper around the Groq Python SDK.

    Usage:
        provider = GroqProvider()
        reply = await provider.complete(system_prompt, user_prompt)
    """

    def __init__(self, api_key: Optional[str] = None) -> None:
        self._api_key = api_key or settings.groq_api_key
        self._model = settings.groq_model or GROQ_CONFIG.model_id
        self._timeout = settings.llm_timeout_seconds
        self._client = AsyncGroq(api_key=self._api_key)
        logger.info("GroqProvider initialised", model=self._model, timeout=self._timeout)

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Send a chat completion request and return the assistant's reply as a string.

        Args:
            system_prompt: System-level instruction for the LLM.
            user_prompt:   User-level content / data to process.
            temperature:   Override the default temperature if provided.
            max_tokens:    Override the default max_tokens if provided.

        Returns:
            The raw text content of the model's first choice message.

        Raises:
            GroqTimeoutError:    If the call does not complete within the timeout.
            GroqQuotaError:      If Groq returns HTTP 429.
            GroqProviderError:   For all other Groq API errors.
        """
        params = GROQ_CONFIG.params
        request_temperature = temperature if temperature is not None else params.temperature
        request_max_tokens = max_tokens if max_tokens is not None else params.max_tokens

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt},
        ]

        logger.debug(
            "GroqProvider sending request",
            model=self._model,
            temperature=request_temperature,
            max_tokens=request_max_tokens,
        )

        try:
            response = await asyncio.wait_for(
                self._client.chat.completions.create(
                    model=self._model,
                    messages=messages,
                    temperature=request_temperature,
                    max_tokens=request_max_tokens,
                    top_p=params.top_p,
                    # Request JSON output where supported
                    response_format={"type": "json_object"} if GROQ_CONFIG.supports_json_mode else None,
                ),
                timeout=self._timeout,
            )
        except asyncio.TimeoutError as exc:
            logger.warning("GroqProvider timeout", timeout=self._timeout)
            raise GroqTimeoutError(
                f"Groq did not respond within {self._timeout}s"
            ) from exc
        except groq.RateLimitError as exc:
            logger.warning("GroqProvider quota exceeded (429)")
            raise GroqQuotaError("Groq rate limit / quota exceeded") from exc
        except groq.APIStatusError as exc:
            logger.error("GroqProvider API error", status_code=exc.status_code, message=str(exc))
            raise GroqProviderError(f"Groq API error {exc.status_code}: {exc.message}") from exc
        except groq.APIConnectionError as exc:
            logger.error("GroqProvider connection error", error=str(exc))
            raise GroqProviderError(f"Groq connection error: {exc}") from exc

        content = response.choices[0].message.content
        if content is None:
            raise GroqProviderError("Groq returned an empty message content.")

        logger.debug("GroqProvider response received", chars=len(content))
        return content
