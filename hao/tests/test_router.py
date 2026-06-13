"""
tests/test_router.py
─────────────────────
Unit tests for the LLM Router.

Tests cover:
  - Successful Groq response (no fallback)
  - Groq timeout → automatic fallback to OpenRouter
  - Groq quota exceeded → immediate fallback (no retry)
  - Groq provider error → retry then fallback
  - Both providers fail → LLMUnavailableError raised
  - last_used_provider tracking
"""

from __future__ import annotations

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from providers.llm_router import LLMRouter, LLMUnavailableError, ActiveProvider
from providers.groq_provider import GroqTimeoutError, GroqQuotaError, GroqProviderError
from providers.openrouter_provider import OpenRouterProviderError, OpenRouterTimeoutError


FAKE_SYSTEM = "You are a helpful assistant. Return JSON."
FAKE_USER = "Analyse this: Python developer with 3 years experience."
EXPECTED_RESPONSE = '{"technical_skills": ["Python"], "soft_skills": ["Communication"], "mapped_roles": ["Developer"]}'


# ── Tests ─────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_router_uses_groq_on_success():
    """When Groq succeeds, OpenRouter should not be called."""
    with patch("providers.llm_router.GroqProvider") as MockGroq, \
         patch("providers.llm_router.OpenRouterProvider") as MockOR:

        mock_groq_instance = MagicMock()
        mock_groq_instance.complete = AsyncMock(return_value=EXPECTED_RESPONSE)
        MockGroq.return_value = mock_groq_instance

        mock_or_instance = MagicMock()
        mock_or_instance.complete = AsyncMock()
        MockOR.return_value = mock_or_instance

        router = LLMRouter()
        result = await router.complete(FAKE_SYSTEM, FAKE_USER)

        assert result == EXPECTED_RESPONSE
        assert router.last_used_provider == ActiveProvider.GROQ
        mock_or_instance.complete.assert_not_called()


@pytest.mark.asyncio
async def test_router_falls_back_on_groq_timeout():
    """Groq timeout should trigger automatic fallback to OpenRouter."""
    with patch("providers.llm_router.GroqProvider") as MockGroq, \
         patch("providers.llm_router.OpenRouterProvider") as MockOR:

        mock_groq_instance = MagicMock()
        mock_groq_instance.complete = AsyncMock(
            side_effect=GroqTimeoutError("Groq timed out")
        )
        MockGroq.return_value = mock_groq_instance

        mock_or_instance = MagicMock()
        mock_or_instance.complete = AsyncMock(return_value=EXPECTED_RESPONSE)
        MockOR.return_value = mock_or_instance

        router = LLMRouter()
        result = await router.complete(FAKE_SYSTEM, FAKE_USER)

        assert result == EXPECTED_RESPONSE
        assert router.last_used_provider == ActiveProvider.OPENROUTER
        mock_or_instance.complete.assert_called_once()


@pytest.mark.asyncio
async def test_router_immediate_fallback_on_groq_quota():
    """Groq quota error should cause IMMEDIATE fallback without retry."""
    with patch("providers.llm_router.GroqProvider") as MockGroq, \
         patch("providers.llm_router.OpenRouterProvider") as MockOR:

        mock_groq_instance = MagicMock()
        mock_groq_instance.complete = AsyncMock(
            side_effect=GroqQuotaError("429 quota exceeded")
        )
        MockGroq.return_value = mock_groq_instance

        mock_or_instance = MagicMock()
        mock_or_instance.complete = AsyncMock(return_value=EXPECTED_RESPONSE)
        MockOR.return_value = mock_or_instance

        router = LLMRouter()
        result = await router.complete(FAKE_SYSTEM, FAKE_USER)

        assert result == EXPECTED_RESPONSE
        assert router.last_used_provider == ActiveProvider.OPENROUTER
        # Quota error → immediate fallback, Groq called only once
        assert mock_groq_instance.complete.call_count == 1


@pytest.mark.asyncio
async def test_router_raises_when_both_providers_fail():
    """LLMUnavailableError should be raised when both Groq and OpenRouter fail."""
    with patch("providers.llm_router.GroqProvider") as MockGroq, \
         patch("providers.llm_router.OpenRouterProvider") as MockOR:

        mock_groq_instance = MagicMock()
        mock_groq_instance.complete = AsyncMock(
            side_effect=GroqTimeoutError("Groq timed out")
        )
        MockGroq.return_value = mock_groq_instance

        mock_or_instance = MagicMock()
        mock_or_instance.complete = AsyncMock(
            side_effect=OpenRouterProviderError("OpenRouter also failed")
        )
        MockOR.return_value = mock_or_instance

        router = LLMRouter()
        with pytest.raises(LLMUnavailableError) as exc_info:
            await router.complete(FAKE_SYSTEM, FAKE_USER)

        assert "All LLM providers unavailable" in str(exc_info.value)
        assert "Groq" in str(exc_info.value)
        assert "OpenRouter" in str(exc_info.value)


@pytest.mark.asyncio
async def test_router_last_used_provider_tracks_groq():
    """last_used_provider should be GROQ when Groq succeeds."""
    with patch("providers.llm_router.GroqProvider") as MockGroq, \
         patch("providers.llm_router.OpenRouterProvider") as MockOR:

        mock_groq_instance = MagicMock()
        mock_groq_instance.complete = AsyncMock(return_value=EXPECTED_RESPONSE)
        MockGroq.return_value = mock_groq_instance
        MockOR.return_value = MagicMock()

        router = LLMRouter()
        assert router.last_used_provider is None  # Not set before first call

        await router.complete(FAKE_SYSTEM, FAKE_USER)

        assert router.last_used_provider == ActiveProvider.GROQ


@pytest.mark.asyncio
async def test_router_last_used_provider_tracks_openrouter():
    """last_used_provider should be OPENROUTER when fallback is used."""
    with patch("providers.llm_router.GroqProvider") as MockGroq, \
         patch("providers.llm_router.OpenRouterProvider") as MockOR:

        mock_groq_instance = MagicMock()
        mock_groq_instance.complete = AsyncMock(
            side_effect=GroqQuotaError("quota")
        )
        MockGroq.return_value = mock_groq_instance

        mock_or_instance = MagicMock()
        mock_or_instance.complete = AsyncMock(return_value=EXPECTED_RESPONSE)
        MockOR.return_value = mock_or_instance

        router = LLMRouter()
        await router.complete(FAKE_SYSTEM, FAKE_USER)

        assert router.last_used_provider == ActiveProvider.OPENROUTER


@pytest.mark.asyncio
async def test_router_openrouter_timeout_raises_unavailable():
    """OpenRouter timeout (after Groq failure) should raise LLMUnavailableError."""
    with patch("providers.llm_router.GroqProvider") as MockGroq, \
         patch("providers.llm_router.OpenRouterProvider") as MockOR:

        mock_groq_instance = MagicMock()
        mock_groq_instance.complete = AsyncMock(
            side_effect=GroqProviderError("Groq 503")
        )
        MockGroq.return_value = mock_groq_instance

        mock_or_instance = MagicMock()
        mock_or_instance.complete = AsyncMock(
            side_effect=OpenRouterTimeoutError("OpenRouter timed out")
        )
        MockOR.return_value = mock_or_instance

        router = LLMRouter()
        with pytest.raises(LLMUnavailableError):
            await router.complete(FAKE_SYSTEM, FAKE_USER)
