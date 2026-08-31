-- Migration 002: Motor de Produção e Geração de Ensaios Fotográficos
-- Executar no SQL Editor do Supabase

-- 1. Novos Enums para o Motor de Produção
CREATE TYPE photo_session_status AS ENUM (
  'PENDING',
  'ANALYZING',
  'PLANNING',
  'GENERATING',
  'UPSCALING',
  'VALIDATING',
  'PREVIEW_READY',
  'READY_FOR_REVIEW',
  'APPROVED',
  'REVISION_REQUESTED',
  'FAILED',
  'CANCELLED'
);

CREATE TYPE photo_job_status AS ENUM (
  'QUEUED',
  'GENERATING',
  'UPSCALING',
  'VALIDATING',
  'COMPLETED',
  'FAILED',
  'REVISION_REQUESTED',
  'CANCELLED'
);

-- 2. Tabela de Sessões de Produção (PhotoSessions)
CREATE TABLE IF NOT EXISTS photo_sessions (
  id TEXT PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  category_slug TEXT NOT NULL,
  style_slug TEXT NOT NULL,
  package_photo_count INT NOT NULL,
  identity_profile JSONB,
  shoot_plan JSONB,
  status photo_session_status NOT NULL DEFAULT 'PENDING',
  total_photos INT NOT NULL DEFAULT 6,
  completed_photos INT NOT NULL DEFAULT 0,
  failed_photos INT NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photo_sessions_order ON photo_sessions(order_id);
CREATE INDEX IF NOT EXISTS idx_photo_sessions_status ON photo_sessions(status);

-- 3. Tabela de Jobs Individuais de Foto (PhotoJobs)
CREATE TABLE IF NOT EXISTS photo_jobs (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES photo_sessions(id) ON DELETE CASCADE,
  photo_index INT NOT NULL,
  status photo_job_status NOT NULL DEFAULT 'QUEUED',
  variation JSONB NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  provider_job_id TEXT,
  provider_name TEXT,
  generation_cost_cents INT DEFAULT 0,
  duration_ms INT,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, photo_index)
);

CREATE INDEX IF NOT EXISTS idx_photo_jobs_session ON photo_jobs(session_id);
CREATE INDEX IF NOT EXISTS idx_photo_jobs_status ON photo_jobs(status);

-- 4. Tabela de Versões de Fotografias (v1, v2, v3)
CREATE TABLE IF NOT EXISTS photo_versions (
  id TEXT PRIMARY KEY,
  photo_job_id TEXT NOT NULL REFERENCES photo_jobs(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  prompt_used TEXT NOT NULL,
  raw_image_url TEXT,
  upscaled_image_url TEXT,
  preview_image_url TEXT,
  final_storage_path TEXT,
  preview_storage_path TEXT,
  source_width INT,
  source_height INT,
  final_width INT,
  final_height INT,
  upscale_provider TEXT,
  upscale_model TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photo_versions_job ON photo_versions(photo_job_id);

-- 5. Logs Estruturados de Observabilidade (Production Logs)
CREATE TABLE IF NOT EXISTS production_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  photo_job_id TEXT,
  photo_index INT,
  provider TEXT NOT NULL,
  operation TEXT NOT NULL,
  status TEXT NOT NULL,
  duration_ms INT,
  error TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_production_logs_session ON production_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_production_logs_created ON production_logs(created_at DESC);

-- 6. Row Level Security para o Motor de Produção
ALTER TABLE photo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access photo_sessions" ON photo_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access photo_jobs" ON photo_jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access photo_versions" ON photo_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access production_logs" ON production_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
