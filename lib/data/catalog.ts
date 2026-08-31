import { Category, Package, Style } from '@/lib/types';
import { createAdminClient } from '@/lib/supabase/admin';

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Pacote Básico',
    slug: 'basico',
    description: 'Ideal para quem deseja fotos pontuais com alta definição e enquadramentos essenciais.',
    photo_count: 6,
    price_cents: 1990,
    is_popular: false,
    is_active: true,
    display_order: 1,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    name: 'Pacote Profissional',
    slug: 'profissional',
    description: 'Nosso formato mais procurado. Variedade ampla de ângulos, iluminação de estúdio e composições exclusivas.',
    photo_count: 12,
    price_cents: 2990,
    is_popular: true,
    is_active: true,
    display_order: 2,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    name: 'Pacote Premium',
    slug: 'premium',
    description: 'Cobertura completa com 30 retratos de alta resolução em múltiplas perspectivas e iluminações.',
    photo_count: 30,
    price_cents: 4990,
    is_popular: false,
    is_active: true,
    display_order: 3,
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Gravidez',
    slug: 'gravidez',
    description: 'Celebre a maternidade com retratos sublimes, delicados e cheios de emoção.',
    sample_image_url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Casamento',
    slug: 'casamento',
    description: 'Momentos eternos, poses clássicas e iluminação cinematográfica para noivos.',
    sample_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Aniversário',
    slug: 'aniversario',
    description: 'Ensaios temáticos vibrantes e elegantes para celebrar um novo ciclo com brilho.',
    sample_image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Debutante',
    slug: 'debutante',
    description: 'O encanto dos 15 anos registrado com sofisticação, moda e personalidade única.',
    sample_image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Recém-nascido',
    slug: 'recem-nascido',
    description: 'A ternura dos primeiros dias em composições acolhedoras e iluminação suave.',
    sample_image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Mêsversário',
    slug: 'mesversario',
    description: 'Acompanhamento do crescimento mês a mês em cenários alegres e fofos.',
    sample_image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    display_order: 6,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    name: 'Sensual',
    slug: 'sensual',
    description: 'Fotografia intimista, empoderada, com jogo de sombras e elegância absoluta.',
    sample_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    display_order: 7,
    is_active: true,
  },
];

export const DEFAULT_STYLES: Style[] = [
  // Gravidez
  { id: '38d82d19-c510-42f5-8ed8-4b9de3c32497', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Elegante', slug: 'elegante', description: 'Fundo neutro, tecidos esvoaçantes e iluminação de estúdio suave.', display_order: 1, is_active: true },
  { id: '7b0174ee-5258-4ac2-a82d-858f35d7725c', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Luxo', slug: 'luxo', description: 'Vestidos de alta costura, cenários palacianos e tons dourados refinados.', display_order: 2, is_active: true },
  { id: '1e54cfa5-8e64-47cb-b54a-ba1c106a53cb', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Romântico', slug: 'romantico', description: 'Tons pastéis, arranjos florais naturais e luz difusa aconchegante.', display_order: 3, is_active: true },
  { id: '5f718f10-27ba-4d20-ae9b-c8c26b8bfd1c', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Estúdio Minimalista', slug: 'estudio', description: 'Fundo infinito preto ou branco, contraluz e foco total na silhueta.', display_order: 4, is_active: true },
  { id: 'd366124a-97e4-4d71-810a-125a4f91a916', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Praia ao Entardecer', slug: 'praia', description: 'Pôr do sol dourado, brisa leve e textura de areia com mar suave.', display_order: 5, is_active: true },
  { id: 'f5e21fe8-0d1f-48cf-abea-3d6f1aec81db', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Natureza & Jardim', slug: 'natureza', description: 'Vegetação nobre, luz natural entre folhas e atmosfera orgânica.', display_order: 6, is_active: true },
  { id: '503b0948-f715-4407-8716-941f5c5225d6', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Cinematográfico', slug: 'cinematografico', description: 'Iluminação dramática com contraste editorial marcante.', display_order: 7, is_active: true },

  // Casamento
  { id: '79abd935-4ae4-4c85-9013-17e1524cc79f', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Romântico Clássico', slug: 'romantico-classico', description: 'Alta elegância, véu e grinalda em salão imponente.', display_order: 1, is_active: true },
  { id: '1ddf10da-2b69-407d-83ce-bac9f0840d69', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Luxo Contemporâneo', slug: 'luxo-contemporaneo', description: 'Ambiente sofisticado com iluminação refinada e trajes impecáveis.', display_order: 2, is_active: true },
  { id: 'ffa13009-b4ed-420d-844d-c348d41414fd', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Praia & Destino', slug: 'praia-destino', description: 'Cenário costeiro paradisíaco, luz do entardecer e vestido leve.', display_order: 3, is_active: true },
  { id: '3a890840-a7b5-4ee8-b5f2-8cf18def662f', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Cinematográfico Noturno', slug: 'cinematografico-noturno', description: 'Luzes pontuais, iluminação de filme e atmosfera mágica.', display_order: 4, is_active: true },

  // Aniversário
  { id: '01a560c9-80ec-4172-958b-19281c34442e', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Celebration Glam', slug: 'celebration-glam', description: 'Champanhe, balões metálicos e brilho refinado.', display_order: 1, is_active: true },
  { id: '5ca456ff-0672-40c1-89bb-7b40cc540fc4', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Editorial Retrô', slug: 'editorial-retro', description: 'Cores quentes e estética retrô contemporânea.', display_order: 2, is_active: true },
  { id: '95acdff3-762e-4d64-a8df-352d8dc6e45b', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Clean & Minimal', slug: 'clean-minimal', description: 'Fundo de estúdio puro, bolo decorado e luz suave.', display_order: 3, is_active: true },

  // Debutante
  { id: '5a13672b-7edf-4718-87fe-e3b0c50c8829', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Princesa Moderna', slug: 'princesa-moderna', description: 'Vestido de gala imponente em cenário arquitetônico nobre.', display_order: 1, is_active: true },
  { id: '448a740a-d2aa-4b6b-b39d-d382112d0b42', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Fashion Editorial', slug: 'fashion-editorial', description: 'Estilo revista de moda internacional com poses expressivas.', display_order: 2, is_active: true },
  { id: 'f3448776-990d-4f04-ab86-a95748e08876', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Jardim Encantado', slug: 'jardim-encantado', description: 'Flores, luz mágica e atmosfera lúdica e sofisticada.', display_order: 3, is_active: true },

  // Recém-nascido
  { id: 'cfca908e-3cd1-48b9-915c-eacf675ccb1e', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Aconchego Puro', slug: 'aconchego-puro', description: 'Mantas de lã natural, cestinhos e tons crus.', display_order: 1, is_active: true },
  { id: 'e94abae1-eeb5-4538-9604-d59e2c38176a', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Sonho Celestial', slug: 'sonho-celestial', description: 'Nuvens estilizadas, tons celestes e luz de penumbra.', display_order: 2, is_active: true },
  { id: '7213d55e-382d-4b8d-af92-9ced3b31faaf', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Minimalista Branco', slug: 'minimalista-branco', description: 'Foco puro nas feições do bebê em fundo branco suave.', display_order: 3, is_active: true },

  // Mêsversário
  { id: 'dd65adc1-5813-4077-8658-898355c96659', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Tema Lúdico Divertido', slug: 'ludico', description: 'Cenários coloridos com números temáticos e brinquedos.', display_order: 1, is_active: true },
  { id: '2bcb4e64-8947-4c7f-ad06-e8eadc004f8a', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Pastel Boho', slug: 'pastel-boho', description: 'Madeiras claras, tons terrosos e bandeirinhas rústicas.', display_order: 2, is_active: true },

  // Sensual
  { id: 'f21768e1-23df-4f08-baa2-485148637483', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Boudoir Elegance', slug: 'boudoir-elegance', description: 'Lingerie fina, cama desfeita em luz de janela matinal.', display_order: 1, is_active: true },
  { id: 'da806ee4-7020-4fd6-b627-c8c2aad89748', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Chiaroscuro & Sombras', slug: 'chiaroscuro', description: 'Jogo de luz e sombra dramático em preto e branco sofisticado.', display_order: 2, is_active: true },
  { id: '4feab3db-438b-49d2-8326-2d4fcb28860b', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Silk & Velvet', slug: 'silk-velvet', description: 'Tecidos nobres de seda e veludo em iluminação quente.', display_order: 3, is_active: true },
];

export async function getCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  if (!supabase) return DEFAULT_CATEGORIES;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function getStylesByCategory(categoryId: string): Promise<Style[]> {
  const supabase = createAdminClient();
  if (!supabase) {
    return DEFAULT_STYLES.filter((s) => (s.category_id === categoryId || s.category_id.includes(categoryId)) && s.is_active);
  }

  try {
    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_STYLES.filter((s) => s.category_id === categoryId && s.is_active);
    }
    return data as Style[];
  } catch {
    return DEFAULT_STYLES.filter((s) => s.category_id === categoryId && s.is_active);
  }
}

export async function getPackages(): Promise<Package[]> {
  const supabase = createAdminClient();
  if (!supabase) return DEFAULT_PACKAGES;

  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_PACKAGES;
    }
    return data as Package[];
  } catch {
    return DEFAULT_PACKAGES;
  }
}
