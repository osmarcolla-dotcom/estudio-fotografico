-- Schema Inicial do Estúdio Fotográfico Digital
-- Executar no SQL Editor do Supabase

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enum types
CREATE TYPE order_status AS ENUM (
  'PENDING_PAYMENT',
  'PAID',
  'PRODUCTION_QUEUED',
  'IN_PRODUCTION',
  'READY_FOR_APPROVAL',
  'REVISION_REQUESTED',
  'APPROVED',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED'
);

CREATE TYPE production_job_status AS ENUM (
  'QUEUED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
);

CREATE TYPE user_role AS ENUM (
  'ADMIN',
  'STAFF'
);

-- 2. Tabela de Usuários Administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'STAFF',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Clientes
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_whatsapp ON customers(whatsapp);

-- 4. Categorias de Ensaio
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  sample_image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Estilos por Categoria
CREATE TABLE IF NOT EXISTS styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  sample_image_url TEXT,
  prompt_preset TEXT, -- Metadados internos de produção/iluminação/estética
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_styles_category ON styles(category_id);

-- 6. Pacotes de Ensaio
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  photo_count INT NOT NULL CHECK (photo_count > 0),
  price_cents INT NOT NULL CHECK (price_cents >= 0),
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Pedidos de Ensaio
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  style_id UUID NOT NULL REFERENCES styles(id),
  package_id UUID NOT NULL REFERENCES packages(id),

  -- Valores congelados no ato da compra
  package_name TEXT NOT NULL,
  package_photo_count INT NOT NULL,
  package_price_cents INT NOT NULL,
  category_name TEXT NOT NULL,
  style_name TEXT NOT NULL,

  status order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 8. Pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'manual', -- 'mercadopago', 'stripe', 'pix_direct', 'manual'
  transaction_id TEXT,
  amount_cents INT NOT NULL,
  status payment_status NOT NULL DEFAULT 'PENDING',
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);

-- 9. Fotos Enviadas pelo Cliente (Originais)
CREATE TABLE IF NOT EXISTS customer_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes INT NOT NULL,
  mime_type TEXT NOT NULL,
  width INT,
  height INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_photos_order ON customer_photos(order_id);

-- 10. Links de Aprovação Únicos para o Cliente
CREATE TABLE IF NOT EXISTS approval_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ,
  view_count INT NOT NULL DEFAULT 0,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_links_token ON approval_links(token);

-- 11. Fotos Produzidas do Ensaio (Previews e Finais)
CREATE TABLE IF NOT EXISTS produced_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  photo_index INT NOT NULL,
  preview_storage_path TEXT NOT NULL,
  final_storage_path TEXT NOT NULL,
  variation_description TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(order_id, photo_index)
);

CREATE INDEX IF NOT EXISTS idx_produced_photos_order ON produced_photos(order_id);

-- 12. Jobs de Produção Interna
CREATE TABLE IF NOT EXISTS production_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  status production_job_status NOT NULL DEFAULT 'QUEUED',
  parameters JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_production_jobs_order ON production_jobs(order_id);
CREATE INDEX IF NOT EXISTS idx_production_jobs_status ON production_jobs(status);

-- 13. Solicitações de Ajuste / Revisão
CREATE TABLE IF NOT EXISTS revision_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  produced_photo_id UUID REFERENCES produced_photos(id) ON DELETE SET NULL,
  photo_index INT,
  reason TEXT NOT NULL,
  comment TEXT,
  is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revision_requests_order ON revision_requests(order_id);

-- Funções para atualização automática de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_update_updated_at ON %I;', t);
    EXECUTE format('CREATE TRIGGER trg_update_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();', t);
  END LOOP;
END $$;

-- 14. Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE produced_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_requests ENABLE ROW LEVEL SECURITY;

-- Catálogo: Leitura pública de itens ativos
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active styles" ON styles FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active packages" ON packages FOR SELECT USING (is_active = true);

-- Políticas de Administração (usuários autenticados no admin_users)
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access styles" ON styles FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access packages" ON packages FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access customers" ON customers FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access photos" ON produced_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access jobs" ON production_jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin full access revisions" ON revision_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);
