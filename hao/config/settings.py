"""
config/settings.py
──────────────────
Global application settings loaded from environment variables.
Uses pydantic-settings for type-safe configuration management.
"""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """
    Central settings object.  All values are read from the .env file
    (or the actual environment), with sensible defaults where possible.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── LLM Provider Keys ────────────────────────────────────────────────────────
    groq_api_key: str = Field(..., description="Groq API key (primary LLM provider)")
    openrouter_api_key: str = Field(..., description="OpenRouter API key (fallback provider)")

    # ── Model Selection ──────────────────────────────────────────────────────────
    groq_model: str = Field(
        default="llama3-70b-8192",
        description="Groq model identifier.  Llama 3 70B is the required primary model.",
    )
    openrouter_model: str = Field(
        default="mistralai/mistral-7b-instruct:free",
        description="OpenRouter model identifier (free tier fallback).",
    )

    # ── Routing & Retry ──────────────────────────────────────────────────────────
    llm_timeout_seconds: int = Field(
        default=30,
        description="Seconds before a provider call is declared timed out.",
    )
    llm_max_retries: int = Field(
        default=2,
        description="Number of retry attempts on the primary provider before falling back.",
    )

    # ── Logging ──────────────────────────────────────────────────────────────────
    log_level: str = Field(
        default="INFO",
        description="Logging verbosity: DEBUG | INFO | WARNING | ERROR",
    )

    # ── OpenRouter base URL ──────────────────────────────────────────────────────
    openrouter_base_url: str = Field(
        default="https://openrouter.ai/api/v1",
        description="Base URL for the OpenRouter API (OpenAI-compatible).",
    )


# Singleton — import this everywhere instead of re-instantiating Settings.
settings = Settings()  # type: ignore[call-arg]
