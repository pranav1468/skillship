"""
File:    ai-service/app/routers/career.py
Purpose: /career/ask — CareerPilot agent.
"""

from fastapi import APIRouter, Depends
from app.agents import career_pilot
from app.deps import GeminiClient, verify_internal_key
from app.schemas.career import CareerAskRequest, CareerAskResponse

router = APIRouter(prefix="/career", dependencies=[Depends(verify_internal_key)])


@router.post("/ask", response_model=CareerAskResponse)
async def ask_career_question(request: CareerAskRequest, client: GeminiClient):
    result = await career_pilot.run(
        client=client,
        student_context=request.student_context,
        question=request.question,
        history=request.history,
    )
    return CareerAskResponse(**result)
