"""
File:    ai-service/app/agents/career_pilot.py
Purpose: CareerPilot agent — personalised career path suggestions.
"""

from __future__ import annotations
import json
import logging
from pathlib import Path

from google import genai
from google.genai import types

from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    Path(__file__).parent.parent / "prompts" / "career_pilot.md"
).read_text(encoding="utf-8")


async def run(
    client: genai.Client,
    student_context: dict,
    question: str,
    history: list[dict],
) -> dict:
    context_lines = "\n".join(f"  {k}: {v}" for k, v in student_context.items())
    user_message = f"Student profile:\n{context_lines}\n\nQuestion: {question}"

    contents = [
        {"role": "model" if m["role"] == "assistant" else "user",
         "parts": [{"text": m["content"]}]}
        for m in history[-6:]
    ]
    contents.append({"role": "user", "parts": [{"text": user_message}]})

    response = await client.aio.models.generate_content(
        model=settings.MODEL_NAME,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
        ),
    )

    return json.loads(response.text)
