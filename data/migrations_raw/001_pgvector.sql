-- File:    data/migrations_raw/001_pgvector.sql
-- Purpose: Enable pgvector extension and create the RAG table for content chunks.
-- Why:     Django ORM cannot create PostgreSQL extensions; must be raw SQL.
-- Owner:   Navanish
-- Run:     psql $DATABASE_URL -f data/migrations_raw/001_pgvector.sql

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS content_chunks (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id   uuid NOT NULL,
    content_id  uuid NOT NULL,
    chunk_index int  NOT NULL,
    chunk_text  text NOT NULL,
    embedding   vector(768) NOT NULL,
    created_at  timestamptz DEFAULT now()
);

-- Fast lookup by tenant
CREATE INDEX IF NOT EXISTS content_chunks_school_id_idx
    ON content_chunks (school_id);

-- Cosine similarity index (ANN search)
CREATE INDEX IF NOT EXISTS content_chunks_embedding_idx
    ON content_chunks
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
