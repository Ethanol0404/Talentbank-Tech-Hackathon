"""
config/model_config.py
──────────────────────
LLM model parameters for each provider.
Centralises all generation hyper-parameters so they are easy to tune
without touching prompt or engine code.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass(frozen=True)
class ModelParameters:
    """
    Generation parameters passed to the LLM on every call.

    Frozen so that accidental mutation at runtime is caught immediately.
    All prompts in CareerOS require deterministic, JSON-only output, so:
        - temperature is kept very low (near-greedy decoding)
        - top_p is set close to 1 to avoid cutting off valid tokens
        - JSON-mode is enabled where the provider supports it
    """

    temperature: float = 0.1          # Low → deterministic / reproducible
    max_tokens: int = 2048            # Enough for any structured JSON response
    top_p: float = 0.95
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    stop: Optional[list[str]] = None  # No early-stop tokens; rely on max_tokens


@dataclass(frozen=True)
class ProviderModelConfig:
    """Full configuration for one LLM provider."""

    provider_name: str
    model_id: str
    params: ModelParameters = field(default_factory=ModelParameters)
    supports_json_mode: bool = True   # Whether to pass response_format={"type":"json_object"}


# ── Groq (Primary) ────────────────────────────────────────────────────────────
GROQ_CONFIG = ProviderModelConfig(
    provider_name="groq",
    model_id="llama3-70b-8192",       # Llama 3 70B — as specified
    params=ModelParameters(
        temperature=0.1,
        max_tokens=2048,
        top_p=0.95,
    ),
    supports_json_mode=True,
)

# ── OpenRouter (Fallback) ─────────────────────────────────────────────────────
OPENROUTER_CONFIG = ProviderModelConfig(
    provider_name="openrouter",
    model_id="mistralai/mistral-7b-instruct:free",  # Free tier model
    params=ModelParameters(
        temperature=0.15,             # Slightly higher — free model may need it
        max_tokens=2048,
        top_p=0.95,
    ),
    supports_json_mode=False,         # OpenRouter free models vary in JSON support
)


def get_config_for_provider(provider_name: str) -> ProviderModelConfig:
    """
    Retrieve the pre-configured parameters for a given provider name.

    Args:
        provider_name: One of "groq" or "openrouter".

    Returns:
        ProviderModelConfig for the requested provider.

    Raises:
        ValueError: If the provider name is not recognised.
    """
    configs: dict[str, ProviderModelConfig] = {
        "groq": GROQ_CONFIG,
        "openrouter": OPENROUTER_CONFIG,
    }
    if provider_name not in configs:
        raise ValueError(
            f"Unknown provider '{provider_name}'. Valid options: {list(configs.keys())}"
        )
    return configs[provider_name]
