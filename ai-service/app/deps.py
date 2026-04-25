"""
File:    ai-service/app/deps.py
Purpose: FastAPI dependency-injection helpers — auth, Gemini client, DB connection.
"""

from typing import Annotated

import psycopg
from fastapi import Depends, Header, HTTPException, Request, status
from google import genai

from app.config import settings


def verify_internal_key(x_internal_key: str = Header(...)) -> str:
    if x_internal_key != settings.AI_SERVICE_INTERNAL_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid internal API key",
        )
    return x_internal_key


VerifiedKey = Annotated[str, Depends(verify_internal_key)]


async def get_gemini(request: Request) -> genai.Client:
    return request.app.state.gemini


async def get_db(request: Request) -> psycopg.AsyncConnection:
    db = request.app.state.db
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not connected. Check PGVECTOR_URL.",
        )
    return db


GeminiClient = Annotated[genai.Client, Depends(get_gemini)]
DB = Annotated[psycopg.AsyncConnection, Depends(get_db)]
