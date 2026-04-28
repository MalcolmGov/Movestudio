-- =============================================================================
-- Move Design Library — Supabase schema
--
-- Run this once in the Supabase SQL Editor
-- (project: xjbyfvflpcqushjzinip → SQL Editor → New Query → paste → Run).
--
-- What this sets up:
--   1. public.projects table (user-owned builder projects)
--   2. Row-Level Security so users only see their own rows
--   3. An updated_at trigger
-- =============================================================================

-- ── Projects table ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.projects (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           text NOT NULL,
  slug           text,
  kit            jsonb NOT NULL DEFAULT '{}'::jsonb,
  sections       jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo            jsonb,
  activity_log   jsonb NOT NULL DEFAULT '[]'::jsonb,
  published_at   timestamptz,
  published_url  text,
  created_at     timestamptz NOT NULL DEFAULT NOW(),
  updated_at     timestamptz NOT NULL DEFAULT NOW()
);

-- Fast lookup by user
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- Unique slugs per user so a user can have one site at each subdomain
-- prefix they choose. (Globally-unique slugs would prevent two customers
-- from both wanting /acme as their slug — we let each have their own
-- namespace and rely on the app to route via user_id + slug combo.)
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_user_slug
  ON public.projects(user_id, slug)
  WHERE slug IS NOT NULL;

-- ── Row-Level Security ─────────────────────────────────────────────────────

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can read their own projects
DROP POLICY IF EXISTS "projects_select_own" ON public.projects;
CREATE POLICY "projects_select_own"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert projects for themselves
DROP POLICY IF EXISTS "projects_insert_own" ON public.projects;
CREATE POLICY "projects_insert_own"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
DROP POLICY IF EXISTS "projects_update_own" ON public.projects;
CREATE POLICY "projects_update_own"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own projects
DROP POLICY IF EXISTS "projects_delete_own" ON public.projects;
CREATE POLICY "projects_delete_own"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- ── updated_at trigger ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Future tables (Week 3+):
--   - public.published_sites (slug → html, served from a Vercel function)
--   - public.form_submissions (per-project, captured from published sites)
--   - public.uploads (image asset metadata, files in Supabase Storage bucket)
-- =============================================================================
