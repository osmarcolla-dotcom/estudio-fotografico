-- Seed inicial do catálogo do Estúdio Fotográfico Digital
-- Executar após a migration 001_initial_schema.sql

-- 1. Pacotes Iniciais
INSERT INTO packages (id, name, slug, description, photo_count, price_cents, is_popular, is_active, display_order)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Pacote Básico', 'basico', 'Ideal para quem deseja fotos pontuais com alta definição e enquadramentos essenciais.', 6, 1990, false, true, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Pacote Profissional', 'profissional', 'Nosso formato mais procurado. Variedade ampla de ângulos, iluminação de estúdio e composições exclusivas.', 12, 2990, true, true, 2),
  ('a1000000-0000-0000-0000-000000000003', 'Pacote Premium', 'premium', 'Cobertura completa com 30 retratos de alta resolução em múltiplas perspectivas e iluminações.', 30, 4990, false, true, 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  photo_count = EXCLUDED.photo_count,
  price_cents = EXCLUDED.price_cents,
  is_popular = EXCLUDED.is_popular,
  description = EXCLUDED.description;

-- 2. Categorias Iniciais
INSERT INTO categories (id, name, slug, description, sample_image_url, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Gravidez', 'gravidez', 'Celebre a maternidade com retratos sublimes, delicados e cheios de emoção.', '/samples/gravidez.jpg', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Casamento', 'casamento', 'Momentos eternos, poses clássicas e iluminação cinematográfica para noivos.', '/samples/casamento.jpg', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Aniversário', 'aniversario', 'Ensaios temáticos vibrantes e elegantes para celebrar um novo ciclo.', '/samples/aniversario.jpg', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Debutante', 'debutante', 'O encanto dos 15 anos registrado com sofisticação, moda e personalidade.', '/samples/debutante.jpg', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Recém-nascido', 'recem-nascido', 'A ternura dos primeiros dias em composições acolhedoras e iluminação suave.', '/samples/recem-nascido.jpg', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Mêsversário', 'mesversario', 'Acompanhamento do crescimento mês a mês em cenários alegres e fofos.', '/samples/mesversario.jpg', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'Sensual', 'sensual', 'Fotografia intimista, empoderada, com jogo de sombras e elegância absoluta.', '/samples/sensual.jpg', 7, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sample_image_url = EXCLUDED.sample_image_url;

-- 3. Estilos por Categoria

-- Gravidez
INSERT INTO styles (category_id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Elegante', 'elegante', 'Fundo neutro, tecidos esvoaçantes e iluminação de estúdio suave.', 1, true),
  ('c1000000-0000-0000-0000-000000000001', 'Luxo', 'luxo', 'Vestidos de alta costura, cenários palacianos e tons dourados refinados.', 2, true),
  ('c1000000-0000-0000-0000-000000000001', 'Romântico', 'romantico', 'Tons pastéis, arranjos florais naturais e luz difusa aconchegante.', 3, true),
  ('c1000000-0000-0000-0000-000000000001', 'Estúdio Minimalista', 'estudio', 'Fundo infinito preto ou branco, contraluz e foco total na silhueta.', 4, true),
  ('c1000000-0000-0000-0000-000000000001', 'Praia ao Entardecer', 'praia', 'Pôr do sol dourado, brisa leve e textura de areia com mar suave.', 5, true),
  ('c1000000-0000-0000-0000-000000000001', 'Natureza & Jardim', 'natureza', 'Vegetação nobre, luz natural entre folhas e atmosfera orgânica.', 6, true),
  ('c1000000-0000-0000-0000-000000000001', 'Cinematográfico', 'cinematografico', 'Iluminação dramática com contraste editorial marcante.', 7, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Casamento
INSERT INTO styles (category_id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000002', 'Romântico Clássico', 'romantico-classico', 'Alta elegância, véu e grinalda em salão imponente.', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Luxo Contemporâneo', 'luxo-contemporaneo', 'Ambiente sofisticado com iluminação refinada e trajes impecáveis.', 2, true),
  ('c1000000-0000-0000-0000-000000000002', 'Praia & Destino', 'praia-destino', 'Cenário costeiro paradisíaco, luz do entardecer e vestido leve.', 3, true),
  ('c1000000-0000-0000-0000-000000000002', 'Cinematográfico Noturno', 'cinematografico-noturno', 'Luzes pontuais, iluminação de filme e atmosfera mágica.', 4, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Aniversário
INSERT INTO styles (category_id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000003', 'Celebration Glam', 'celebration-glam', 'Champanhe, balões metálicos e brilho refinado.', 1, true),
  ('c1000000-0000-0000-0000-000000000003', 'Editorial Retrô', 'editorial-retro', 'Cores quentes e estética retrô contemporânea.', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Clean & Minimal', 'clean-minimal', 'Fundo de estúdio puro, bolo decorado e luz suave.', 3, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Debutante
INSERT INTO styles (category_id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000004', 'Princesa Moderna', 'princesa-moderna', 'Vestido de gala imponente em cenário arquitetônico nobre.', 1, true),
  ('c1000000-0000-0000-0000-000000000004', 'Fashion Editorial', 'fashion-editorial', 'Estilo revista de moda internacional com poses expressivas.', 2, true),
  ('c1000000-0000-0000-0000-000000000004', 'Jardim Encantado', 'jardim-encantado', 'Flores, luz mágica e atmosfera lúdica e sofisticada.', 3, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Recém-nascido
INSERT INTO styles (category_id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000005', 'Aconchego Puro', 'aconchego-puro', 'Mantas de lã natural, cestinhos e tons crus.', 1, true),
  ('c1000000-0000-0000-0000-000000000005', 'Sonho Celestial', 'sonho-celestial', 'Nuvens estilizadas, tons celestes e luz de penumbra.', 2, true),
  ('c1000000-0000-0000-0000-000000000005', 'Minimalista Branco', 'minimalista-branco', 'Foco puro nas feições do bebê em fundo branco suave.', 3, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Mêsversário
INSERT INTO styles (category_id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000006', 'Tema Lúdico Divertido', 'ludico', 'Cenários coloridos com números temáticos e brinquedos.', 1, true),
  ('c1000000-0000-0000-0000-000000000006', 'Pastel Boho', 'pastel-boho', 'Madeiras claras, tons terrosos e bandeirinhas rústicas.', 2, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Sensual
INSERT INTO styles (category_id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000007', 'Boudoir Elegance', 'boudoir-elegance', 'Lingerie fina, cama desfeita em luz de janela matinal.', 1, true),
  ('c1000000-0000-0000-0000-000000000007', 'Chiaroscuro & Sombras', 'chiaroscuro', 'Jogo de luz e sombra dramático em preto e branco sofisticado.', 2, true),
  ('c1000000-0000-0000-0000-000000000007', 'Silk & Velvet', 'silk-velvet', 'Tecidos nobres de seda e veludo em iluminação quente.', 3, true)
ON CONFLICT (category_id, slug) DO NOTHING;
