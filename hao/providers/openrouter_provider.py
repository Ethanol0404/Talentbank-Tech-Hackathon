"""
providers/openrouter_provider.py
────────────────────────────────
Fallback LLM provider: OpenRouter (free tier model).

OpenRouter exposes an OpenAI-compatible API, so we use the openai SDK
pointed at https://openrouter.ai/api/v1.

Responsibilities:
  - Send chat completion requests to OpenRouter.
  - Enforce timeout.
  - Classify errors for the router.
  - Return a plain string reply or raise a typed exception.
"""

from __future__ import annotations

import asyncio
from typing import Optional

from openai import AsyncOpenAI, RateLimitError, APIStatusError, APIConnectionError

from config.settings import settings
from config.model_config import OPENROUTER_CONFIG
from utils.logger import get_logger

logger = get_logger(__name__)


# ── Typed Exceptions ──────────────────────────────────────────────────────────

class OpenRouterTimeoutError(Exception):
    """Raised when the OpenRouter call exceeds the configured timeout."""


class OpenRouterQuotaError(Exception):
    """Raised when OpenRouter returns HTTP 429."""


class OpenRouterProviderError(Exception):
    """Raised for any other OpenRouter API error."""


# ── Provider Class ────────────────────────────────────────────────────────────

class OpenRouterProvider:
    """
    Async wrapper around OpenRouter's OpenAI-compatible API.

    OpenRouter requires two extra HTTP headers:
      - HTTP-Referer  (identifies your application)
      - X-Title       (human-readable app name, shown in OpenRouter dashboard)

    Usage:
        provider = OpenRouterProvider()
        reply = await provider.complete(system_prompt, user_prompt)
    """

    _HTTP_REFERER = "https://careeros.hackathon"
    _X_TITLE = "CareerOS AI Layer"

    def __init__(self, api_key: Optional[str] = None) -> None:
        self._api_key = api_key or settings.openrouter_api_key
        self._model = settings.openrouter_model or OPENROUTER_CONFIG.model_id
        self._timeout = settings.llm_timeout_seconds
        self._client = AsyncOpenAI(
            api_key=self._api_key,
            base_url=settings.openrouter_base_url,
            default_headers={
                "HTTP-Referer": self._HTTP_REFERER,
                "X-Title": self._X_TITLE,
            },
        )
        logger.info("OpenRouterProvider initialised", model=self._model, timeout=self._timeout)

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Send a chat completion request to OpenRouter and return the reply.

        Args:
            system_prompt: System-level instruction for the LLM.
            user_prompt:   User-level content / data to process.
            temperature:   Override the default temperature if provided.
            max_tokens:    Override the default max_tokens if provided.

        Returns:
            The raw text content of the model's first choice message.

        Raises:
            OpenRouterTimeoutError:  If the call does not complete within timeout.
            OpenRouterQuotaError:    If OpenRouter returns HTTP 429.
            OpenRouterProviderError: For all other API errors.
        """
        params = OPENROUTER_CONFIG.params
        request_temperature = temperature if temperature is not None else params.temperature
        request_max_tokens = max_tokens if max_tokens is not None else params.max_tokens

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt},
        ]

        logger.debug(
            "OpenRouterProvider sending request",
            model=self._model,
            temperature=request_temperature,
        )

        try:
            response = await asyncio.wait_for(
                self._client.chat.completions.create(
                    model=self._model,
                    messages=messages,
                    temperature=request_temperature,
                    max_tokens=request_max_tokens,
                    top_p=params.top_p,
                    # Note: free-tier OpenRouter models may not honour json_object mode
                ),
                timeout=self._timeout,
            )
        except asyncio.TimeoutError as exc:
            logger.warning("OpenRouterProvider timeout", timeout=self._timeout)
            raise OpenRouterTimeoutError(
                f"OpenRouter did not respond within {self._timeout}s"
            ) from exc
        except RateLimitError as exc:
            logger.warning("OpenRouterProvider quota exceeded (429)")
            raise OpenRouterQuotaError("OpenRouter rate limit / quota exceeded") from exc
        except APIStatusError as exc:
            logger.error("OpenRouterProvider API error", status_code=exc.status_code)
            raise OpenRouterProviderError(
                f"OpenRouter API error {exc.status_code}: {exc.message}"
            ) from exc
        except APIConnectionError as exc:
            logger.error("OpenRouterProvider connection error", error=str(exc))
            raise OpenRouterProviderError(f"OpenRouter connection error: {exc}") from exc

        content = response.choices[0].message.content
        if content is None:
            raise OpenRouterProviderError("OpenRouter returned an empty message content.")

        logger.debug("OpenRouterProvider response received", chars=len(content))
        return content
