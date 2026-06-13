"""
utils/logger.py
───────────────
Structured logging using structlog.

All CareerOS AI modules use `get_logger(__name__)` to obtain a context-aware
logger that emits JSON-friendly structured log records.
"""

from __future__ import annotations

import logging
import structlog

from config.settings import settings


def _configure_logging() -> None:
    """
    Configure structlog once at import time.
    Sets up shared processors and bound context.
    """
    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)

    logging.basicConfig(
        format="%(message)s",
        level=log_level,
    )

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.dev.ConsoleRenderer(),  # Switch to JSONRenderer in production
        ],
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
    )


# Run configuration once when the module is first imported
_configure_logging()


def get_logger(name: str) -> structlog.BoundLogger:
    """
    Return a structlog BoundLogger bound to the given module name.

    Usage:
        from utils.logger import get_logger
        logger = get_logger(__name__)
        logger.info("Something happened", key="value")

    Args:
        name: Typically ``__name__`` of the calling module.

    Returns:
        A structlog BoundLogger instance.
    """
    return structlog.get_logger(name)
