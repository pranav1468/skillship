"""
File:    ai-service/app/routers/content.py
Purpose: /content/tag — auto-tags uploaded content.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.agents import content_agent
from app.deps import GeminiClient, verify_internal_key

router = APIRouter(prefix="/content", dependencies=[Depends(verify_internal_key)])


class ContentTagRequest(BaseModel):
    title: str
    description: str
    kind: str
    file_url: str = ""


class ContentTagResponse(BaseModel):
    tags: list[str]
    summary: str
    grade_level: str
    difficulty: str
    prerequisites: list[str]


@router.post("/tag", response_model=ContentTagResponse)
async def tag_content(request: ContentTagRequest, client: GeminiClient):
    result = await content_agent.tag(
        client=client,
        title=request.title, description=request.description,
        kind=request.kind, file_url=request.file_url,
    )
    return ContentTagResponse(**result)
