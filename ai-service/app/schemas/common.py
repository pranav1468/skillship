"""
File:    ai-service/app/schemas/common.py
Purpose: Shared DTOs reused across 2+ endpoints.
"""

from __future__ import annotations
from enum import Enum
from pydantic import BaseModel


class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuestionType(str, Enum):
    MCQ = "mcq"
    TF = "tf"
    SHORT = "short"


class Option(BaseModel):
    id: str    # "A", "B", "C", "D" or "True"/"False"
    text: str


class Question(BaseModel):
    id: str
    text: str
    type: QuestionType
    options: list[Option]           # empty for SHORT
    correct_option_ids: list[str]   # empty for SHORT
    difficulty: Difficulty
    tags: list[str] = []
    rubric: str = ""                # grading guide for SHORT answers
