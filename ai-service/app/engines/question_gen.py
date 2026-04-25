"""
File:    ai-service/app/engines/question_gen.py
Purpose: Generate MCQ/TF/SHORT questions using Gemini JSON mode.
"""

from __future__ import annotations
import json
import uuid
import logging
from pathlib import Path

from google import genai
from google.genai import types

from app.config import settings
from app.schemas.common import Difficulty, Option, Question, QuestionType

logger = logging.getLogger(__name__)

_PROMPT_TEMPLATE = (
    Path(__file__).parent.parent / "prompts" / "question_gen.md"
).read_text(encoding="utf-8")


def _build_prompt(topic, grade, count, difficulty, q_types, course_context) -> str:
    type_labels = ", ".join(t.value.upper() for t in q_types)
    context_block = f"\nAdditional course context:\n{course_context}\n" if course_context else ""
    return _PROMPT_TEMPLATE.format(
        topic=topic, grade=grade, count=count,
        difficulty=difficulty.value, types=type_labels,
        course_context_block=context_block,
    )


def _parse(raw: str) -> list[Question]:
    text = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    data = json.loads(text)
    return [
        Question(
            id=str(uuid.uuid4()),
            text=item["text"],
            type=QuestionType(item["type"]),
            options=[Option(id=o["id"], text=o["text"]) for o in item.get("options", [])],
            correct_option_ids=item.get("correct_option_ids", []),
            difficulty=Difficulty(item.get("difficulty", "medium")),
            tags=item.get("tags", []),
            rubric=item.get("rubric", ""),
        )
        for item in data
    ]


async def generate(
    client: genai.Client,
    topic: str,
    grade: str,
    count: int = 5,
    difficulty: Difficulty = Difficulty.MEDIUM,
    types_: list[QuestionType] = None,
    course_context: str = "",
) -> list[Question]:
    if types_ is None:
        types_ = [QuestionType.MCQ]

    prompt = _build_prompt(topic, grade, count, difficulty, types_, course_context)

    response = await client.aio.models.generate_content(
        model=settings.MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )

    questions = _parse(response.text)
    logger.info("Generated %d questions on '%s' (%s)", len(questions), topic, difficulty.value)
    return questions
