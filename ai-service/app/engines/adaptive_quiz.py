"""
File:    ai-service/app/engines/adaptive_quiz.py
Purpose: IRT-lite adaptive difficulty engine — decides the next question difficulty.
Why:     Core Plan 02 feature. Pure logic; no LLM needed.
"""

from __future__ import annotations
from app.schemas.common import Difficulty

_LEVELS = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]
_STREAK_UP = 2    # consecutive correct answers needed to go harder
_STREAK_DOWN = 2  # consecutive wrong answers needed to go easier


def next_difficulty(
    attempt_history: list[dict],
    last_difficulty: Difficulty,
    last_correct: bool,
) -> Difficulty:
    """
    Compute the difficulty for the next question based on recent performance.

    IRT-lite rules:
    - 2+ consecutive correct → move up one level (max HARD).
    - 2+ consecutive wrong  → move down one level (min EASY).
    - Mixed or single result → stay at current level.
    - Never jump more than one level per question.

    Args:
        attempt_history: List of past attempts — each dict has "correct" (bool)
                         and "difficulty" (str). Most recent is last.
        last_difficulty: Difficulty of the question just answered.
        last_correct:    Whether the student got the last question right.

    Returns:
        Difficulty for the next question.
    """
    # Append the current result to reason over the full history.
    history = list(attempt_history) + [
        {"correct": last_correct, "difficulty": last_difficulty.value}
    ]

    current_idx = _LEVELS.index(last_difficulty)

    # Look at the last _STREAK_UP results.
    recent = [h["correct"] for h in history[-_STREAK_UP:]]

    if len(recent) >= _STREAK_UP and all(recent):
        # Consecutive correct streak → go harder.
        return _LEVELS[min(current_idx + 1, len(_LEVELS) - 1)]

    recent_down = [h["correct"] for h in history[-_STREAK_DOWN:]]
    if len(recent_down) >= _STREAK_DOWN and not any(recent_down):
        # Consecutive wrong streak → go easier.
        return _LEVELS[max(current_idx - 1, 0)]

    return last_difficulty
