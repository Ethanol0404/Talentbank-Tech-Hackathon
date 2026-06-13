"""
main.py
───────
CareerOS AI/ML Layer — Main Entry Point

Demonstrates the full AI pipeline:
  1. Load student profile from mock data
  2. Extract hidden skills from resume
  3. Score workplace readiness
  4. Generate capability recommendations
  5. Produce XAI explanations
  6. Rewrite resume bullets

All five engines run through the LLM router (Groq primary / OpenRouter fallback).
Results are written to outputs/run_<timestamp>.json.

Usage:
    python main.py
    python main.py --student student_002
    python main.py --student student_001 --engines skills,readiness,recommend
"""

from __future__ import annotations

import asyncio
import json
import argparse
from datetime import datetime
from pathlib import Path
from typing import Any

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import print as rprint

from engines.hidden_skill_engine import HiddenSkillEngine
from engines.readiness_engine import ReadinessEngine
from engines.recommendation_engine import RecommendationEngine
from engines.explainability_engine import ExplainabilityEngine
from engines.resume_rewriter_engine import ResumeRewriterEngine
from providers.llm_router import LLMRouter
from utils.logger import get_logger

logger = get_logger(__name__)
console = Console()

# ── Data Paths ────────────────────────────────────────────────────────────────
DATA_DIR = Path(__file__).parent / "data"
OUTPUT_DIR = Path(__file__).parent / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)


def load_json(path: Path) -> Any:
    """Load and parse a JSON file."""
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def find_student(students_data: dict, student_id: str) -> dict | None:
    """Find a student record by ID."""
    for s in students_data.get("students", []):
        if s["id"] == student_id:
            return s
    return None


def find_resume(resume_data: dict, student_id: str) -> dict | None:
    """Find a resume record by student_id."""
    for r in resume_data.get("resumes", []):
        if r["student_id"] == student_id:
            return r
    return None


def find_projects(projects_data: dict, student_id: str) -> list[dict]:
    """Find all project records for a student."""
    return [p for p in projects_data.get("projects", []) if p["student_id"] == student_id]


# ── Pipeline ──────────────────────────────────────────────────────────────────

async def run_pipeline(student_id: str = "student_001") -> dict[str, Any]:
    """
    Execute the full 5-engine AI pipeline for a given student.

    Args:
        student_id: ID of the student to process (default: student_001).

    Returns:
        Dict containing all engine outputs, ready for JSON serialisation.
    """
    console.print(Panel(
        f"[bold cyan]CareerOS AI Pipeline[/]\n"
        f"Processing student: [bold]{student_id}[/]",
        border_style="cyan",
    ))

    # ── Load data ─────────────────────────────────────────────────────────────
    console.print("\n[dim]Loading mock data...[/dim]")
    students_data  = load_json(DATA_DIR / "mock_students.json")
    resume_data    = load_json(DATA_DIR / "mock_resume.json")
    projects_data  = load_json(DATA_DIR / "mock_projects.json")

    student = find_student(students_data, student_id)
    if not student:
        raise ValueError(f"Student '{student_id}' not found in mock data.")

    resume = find_resume(resume_data, student_id)
    if not resume:
        raise ValueError(f"Resume for '{student_id}' not found in mock data.")

    projects = find_projects(projects_data, student_id)

    console.print(f"[green]✓[/] Loaded profile for [bold]{student['name']}[/]")
    console.print(f"  Target role: [bold yellow]{student['target_role']}[/]")

    # Shared LLM router (single instance reused across all engines)
    router = LLMRouter()

    results: dict[str, Any] = {
        "student": student["name"],
        "student_id": student_id,
        "target_role": student["target_role"],
        "generated_at": datetime.now().isoformat(),
    }

    # ── Module 1: Hidden Skill Extraction ─────────────────────────────────────
    console.print("\n[bold blue]⟩ Module 1: Hidden Skill Extractor[/]")
    skill_engine = HiddenSkillEngine(router=router)
    skills = await skill_engine.extract(
        text=resume["full_text"],
        source_type="resume",
    )
    results["hidden_skills"] = skills.model_dump()
    console.print(f"  [green]✓[/] Extracted {len(skills.technical_skills)} technical, "
                  f"{len(skills.soft_skills)} soft skills, "
                  f"{len(skills.mapped_roles)} mapped roles")

    # ── Module 2: Readiness Scoring ───────────────────────────────────────────
    console.print("\n[bold blue]⟩ Module 2: Adaptive Readiness Engine[/]")
    readiness_engine = ReadinessEngine(router=router)
    score = await readiness_engine.evaluate(
        resume_text=resume["full_text"],
        projects=[p["description"] for p in projects],
        competitions=student.get("competition_history", []),
        workshops=student.get("workshop_history", []),
        certificates=student.get("certificates", []),
        github_summary=student.get("github_summary"),
    )
    results["readiness_scores"] = score.model_dump()

    # Display score table
    table = Table(title="Readiness Scores", show_header=True, header_style="bold magenta")
    table.add_column("Dimension", style="cyan")
    table.add_column("Score", justify="right")
    table.add_column("Rating")
    for dim, val in score.model_dump().items():
        rating = "🟢 Strong" if val >= 80 else "🟡 Developing" if val >= 60 else "🔴 Gap"
        table.add_row(dim.replace("_", " ").title(), str(val), rating)
    console.print(table)

    # ── Module 3: Recommendations ─────────────────────────────────────────────
    console.print("\n[bold blue]⟩ Module 3: Recommendation Engine[/]")
    rec_engine = RecommendationEngine(router=router)
    recommendations = await rec_engine.recommend(
        readiness_scores=score,
        detected_skills=skills,
        target_role=student["target_role"],
    )
    results["recommendations"] = recommendations.model_dump()
    console.print(f"  [green]✓[/] Identified {len(recommendations.missing_skills)} missing skills, "
                  f"{len(recommendations.recommendations)} recommendations")

    # ── Module 4: Explainability ──────────────────────────────────────────────
    console.print("\n[bold blue]⟩ Module 4: Explainability Engine (XAI)[/]")

    # Build evidence dict from detected skills and student data
    evidence = {
        "technical": skills.technical_skills[:5],  # Top 5 as evidence
        "communication": student.get("leadership_roles", []),
        "leadership": student.get("leadership_roles", []),
        "problem_solving": student.get("competition_history", [])[:3],
        "industry_exposure": student.get("certificates", [])[:3],
    }

    xai_engine = ExplainabilityEngine(router=router)
    explanation = await xai_engine.explain(
        readiness_scores=score,
        evidence=evidence,
        student_name=student["name"],
    )
    results["explainability"] = explanation.model_dump()
    console.print(f"  [green]✓[/] Generated explanation with "
                  f"{len(explanation.strengths)} strengths, "
                  f"{len(explanation.improvement_areas)} improvement areas")

    # ── Module 5: Resume Rewriter ─────────────────────────────────────────────
    console.print("\n[bold blue]⟩ Module 5: Resume Achievement Rewriter[/]")
    rewriter_engine = ResumeRewriterEngine(router=router)
    rewritten = await rewriter_engine.rewrite(
        raw_bullets=resume["raw_bullets"],
        target_role=student["target_role"],
    )
    results["resume_rewriter"] = {
        "original_bullets": resume["raw_bullets"],
        "rewritten_bullets": rewritten.rewritten_bullets,
    }
    console.print(f"  [green]✓[/] Rewrote {len(resume['raw_bullets'])} resume bullets")

    # ── Save output ───────────────────────────────────────────────────────────
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = OUTPUT_DIR / f"run_{student_id}_{timestamp}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    console.print(Panel(
        f"[bold green]✅ Pipeline complete![/]\n"
        f"Output saved to: [cyan]{output_path}[/]",
        border_style="green",
    ))

    return results


# ── CLI ───────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="CareerOS AI/ML Pipeline Runner",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--student",
        default="student_001",
        choices=["student_001", "student_002", "student_003"],
        help="Student ID to process (default: student_001)",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(run_pipeline(student_id=args.student))
