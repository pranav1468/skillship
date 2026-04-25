"""
File:    ai-service/app/routers/quiz.py
Purpose: /quiz/generate, /quiz/adaptive-next, /quiz/grade-short endpoints.
"""

from fastapi import APIRouter, Depends
from app.deps import GeminiClient, verify_internal_key
from app.engines import question_gen, adaptive_quiz, scoring
from app.schemas.quiz import (
    GenerateRequest, GenerateResponse,
    AdaptiveNextRequest, AdaptiveNextResponse,
    GradeShortRequest, GradeShortResponse,
)

router = APIRouter(prefix="/quiz", dependencies=[Depends(verify_internal_key)])


@router.post("/generate", response_model=GenerateResponse)
async def generate_quiz(request: GenerateRequest, client: GeminiClient):
    questions = await question_gen.generate(
        client=client, topic=request.topic, grade=request.grade,
        count=request.count, difficulty=request.difficulty,
        types_=request.types, course_context=request.course_context,
    )
    return GenerateResponse(questions=questions)


@router.post("/adaptive-next", response_model=AdaptiveNextResponse)
async def get_adaptive_next(request: AdaptiveNextRequest, client: GeminiClient):
    next_diff = adaptive_quiz.next_difficulty(
        attempt_history=request.attempt_history,
        last_difficulty=request.last_difficulty,
        last_correct=request.last_correct,
    )
    questions = await question_gen.generate(
        client=client, topic=request.topic, grade=request.grade,
        count=1, difficulty=next_diff,
        types_=request.types, course_context=request.course_context,
    )
    return AdaptiveNextResponse(question=questions[0], difficulty=next_diff)


@router.post("/grade-short", response_model=GradeShortResponse)
async def grade_short_answer(request: GradeShortRequest, client: GeminiClient):
    result = await scoring.grade_short(
        client=client,
        question_text=request.question_text,
        rubric=request.rubric,
        student_answer=request.student_answer,
    )
    return GradeShortResponse(**result)
