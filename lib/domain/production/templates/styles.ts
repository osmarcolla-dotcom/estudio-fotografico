import { StyleProfile } from '../types';

export const STYLE_PROFILES: Record<string, StyleProfile> = {
  // Gravidez
  'gravidez-elegante': {
    category_slug: 'gravidez',
    name: 'Elegante',
    slug: 'elegante',
    artistic_direction: 'Retrato clássico de estúdio de alta sofisticação com foco nas linhas suaves do ventre e expressão serena.',
    lighting_palette: 'Tons neutros marfim, bege, areia e dourado suave. Luz difusa de grande softbox octogonal.',
    scene_environment: 'Estúdio com cortinas fluidas translúcidas de linho cru e piso reflexivo de madeira clara.',
    wardrobe_style: 'Vestido longo de seda ou mousseline com caimento leve que abraça a silhueta da gestação.',
    composition_notes: 'Enquadramentos equilibrados, regra dos terços com espaço negativo elegante.',
    atmosphere: 'Serena, sublime, acolhedora e atemporal.',
    camera_preset: '85mm f/1.4 Portrait Lens, foco cravado nos olhos com desfoque cremoso no fundo',
    depth_of_field: 'f/2.0 suave e orgânico',
    post_processing_finish: 'Color grading editorial quente e aveludado, pele com textura natural e luminosa.',
  },

  'gravidez-luxo': {
    category_slug: 'gravidez',
    name: 'Luxo',
    slug: 'luxo',
    artistic_direction: 'Fotografia de alta costura com atmosfera palaciana e acabamento dramático majestoso.',
    lighting_palette: 'Dourado profundo, âmbar, preto e champanhe. Iluminação dramática com contraluz forte e preenchimento reflexivo dourado.',
    scene_environment: 'Arquitetura clássica com molduras douradas (boiserie), lustres de cristal e mármore.',
    wardrobe_style: 'Vestido de gala estruturado com calda longa em veludo ou tule bordado.',
    composition_notes: 'Linhas verticais imponentes, simetria e presença de cena majestosa.',
    atmosphere: 'Opulenta, grandiosa e cinematográfica.',
    camera_preset: '50mm f/1.2 Cine Lens, nitidez de estúdio de alta resolução',
    depth_of_field: 'f/2.8 com transição de luz impecável',
    post_processing_finish: 'Contraste elevado, tons dourados acentuados e reflexos especulares controlados.',
  },

  'gravidez-romantico': {
    category_slug: 'gravidez',
    name: 'Romântico',
    slug: 'romantico',
    artistic_direction: 'Atmosfera doce e etérea com elementos botânicos naturais e luz envolvente.',
    lighting_palette: 'Tons pastéis, rosa chá, lavanda suave e luz matinal difusa.',
    scene_environment: 'Jardim florido com rosas inglesas, glicínias e luz filtrada pelas folhas.',
    wardrobe_style: 'Vestido floral delicado em renda chantilly com mangas bufantes suaves.',
    composition_notes: 'Composição orgânica com flores em primeiro plano criando bokeh suave.',
    atmosphere: 'Doce, poética e encantadora.',
    camera_preset: '105mm f/2.0 Macro/Portrait, compressão de planos',
    depth_of_field: 'f/1.8 ultra-suave',
    post_processing_finish: 'Tons claros (high key) com leve névoa atmosférica nos reflexos de luz.',
  },

  'gravidez-estudio': {
    category_slug: 'gravidez',
    name: 'Estúdio Minimalista',
    slug: 'estudio',
    artistic_direction: 'Pureza visual total com fundo infinito e jogo técnico de luz e sombra focado na forma.',
    lighting_palette: 'Monocromático ou alto contraste preto e branco; fundo cinza neutro ou preto puro.',
    scene_environment: 'Fundo infinito de estúdio fotográfico sem adereços.',
    wardrobe_style: 'Body justo minimalista ou tecidos pretos/brancos estruturados.',
    composition_notes: 'Silhueta pura, linhas geométricas e recorte impecável.',
    atmosphere: 'Moderna, artística e autêntica.',
    camera_preset: '70mm Studio Prime, nitidez cirúrgica',
    depth_of_field: 'f/5.6 para foco uniforme e definição de contornos',
    post_processing_finish: 'Preto e branco fine-art com gradação tonal rica ou cores puras e dessaturadas.',
  },

  'gravidez-praia': {
    category_slug: 'gravidez',
    name: 'Praia ao Entardecer',
    slug: 'praia',
    artistic_direction: 'Fotografia de destino costeiro com pôr do sol dourado e elementos naturais de mar e areia.',
    lighting_palette: 'Laranja dourado, azul turquesa suave e tons de areia molhada. Golden hour natural.',
    scene_environment: 'Praia deserta ao entardecer com ondas suaves e dunas douradas.',
    wardrobe_style: 'Saída de praia longa em crochet nobre ou vestido esvoaçante de linho branco.',
    composition_notes: 'Horizonte suave e reflexos da luz na água rasa.',
    atmosphere: 'Livre, calorosa, conectada com a natureza.',
    camera_preset: '35mm / 50mm Landscape Portrait',
    depth_of_field: 'f/2.8 balanceando a pessoa e a imensidão do mar',
    post_processing_finish: 'Cores solares quentes e realce do brilho da pele ao sol.',
  },

  'gravidez-natureza': {
    category_slug: 'gravidez',
    name: 'Natureza & Jardim',
    slug: 'natureza',
    artistic_direction: 'Conexão orgânica com a terra e vegetação nobre em luz natural filtrada.',
    lighting_palette: 'Verde esmeralda, musgo, terracota e luz dourada suave.',
    scene_environment: 'Floresta nobre de pinheiros ou bosque com luz volumétrica entre as copas das árvores.',
    wardrobe_style: 'Vestido longo em linho cru ou tons terrosos.',
    composition_notes: 'Enquadramento natural emoldurado por galhos e folhagens.',
    atmosphere: 'Mística, acolhedora e profunda.',
    camera_preset: '85mm f/1.4 Outdoor Portrait',
    depth_of_field: 'f/2.0 com raios de luz visíveis (efeito Tyndall)',
    post_processing_finish: 'Tons terrosos ricos e verdes dessaturados nobres.',
  },

  'gravidez-cinematografico': {
    category_slug: 'gravidez',
    name: 'Cinematográfico',
    slug: 'cinematografico',
    artistic_direction: 'Visual de frame de filme internacional com iluminação dramática anamórfica.',
    lighting_palette: 'Teal & Orange clássico, sombras azuladas e luzes quentes nos rostos.',
    scene_environment: 'Ambiente arquitetônico moderno ou estúdio com luzes de cinema.',
    wardrobe_style: 'Vestido sofisticado com cortes geométricos contemporâneos.',
    composition_notes: 'Proporção cinematográfica com iluminação Rembrandt marcante.',
    atmosphere: 'Intensa, memorável e cinematográfica.',
    camera_preset: '50mm Anamorphic Lens 1.5x squeeze',
    depth_of_field: 'f/2.0 com flare oval sutil',
    post_processing_finish: 'Grão cinematográfico fino de película 35mm e contraste de filme.',
  },

  // Casamento
  'casamento-romantico-classico': {
    category_slug: 'casamento',
    name: 'Romântico Clássico',
    slug: 'romantico-classico',
    artistic_direction: 'A essência do casamento clássico com véu esvoaçante e alta sofisticação cerimonial.',
    lighting_palette: 'Branco pérola, dourado e verde oliva.',
    scene_environment: 'Igreja histórica ou salão nobre com vitrais clássicos.',
    wardrobe_style: 'Vestido de noiva tradicional com renda francesa e véu catedral.',
    composition_notes: 'Composição simétrica e foco no brilho do olhar.',
    atmosphere: 'Emocionante, sagrada e eterna.',
    camera_preset: '85mm f/1.4 Wedding Prime',
    depth_of_field: 'f/2.2',
    post_processing_finish: 'Pele acetinada e brilho sutil nos bordados e joias.',
  },

  'casamento-luxo-contemporaneo': {
    category_slug: 'casamento',
    name: 'Luxo Contemporâneo',
    slug: 'luxo-contemporaneo',
    artistic_direction: 'Editorial de casamento moderno inspirado nas maiores revistas de moda do mundo.',
    lighting_palette: 'Preto, branco puro e toques de prata/platina.',
    scene_environment: 'Cobertura contemporânea com vista urbana panorâmica e design minimalista.',
    wardrobe_style: 'Vestido sereia moderno com corte arquitetônico impecável.',
    composition_notes: 'Poses de alta costura com atitude e elegância.',
    atmosphere: 'Chic, cosmopolita e exclusiva.',
    camera_preset: '50mm f/1.2 Studio Luxury',
    depth_of_field: 'f/2.0',
    post_processing_finish: 'Nitidez cristalina e acabamento editorial de alta moda.',
  },

  // Sensual
  'sensual-boudoir-elegance': {
    category_slug: 'sensual',
    name: 'Boudoir Elegance',
    slug: 'boudoir-elegance',
    artistic_direction: 'Retrato intimista, poético e refinado com luz de janela da manhã.',
    lighting_palette: 'Tons creme, marfim, pele e luz suave filtrada por cortina de voile.',
    scene_environment: 'Suíte master com lençóis brancos de algodão egípcio e cabeceira estofada.',
    wardrobe_style: 'Lingerie fina em seda ou renda nobre, robe de seda fluida.',
    composition_notes: 'Planos detalhe e médios valorizando curvas de forma delicada e elegante.',
    atmosphere: 'Intimista, suave e empoderada.',
    camera_preset: '50mm f/1.4 Natural Light Prime',
    depth_of_field: 'f/1.8 com transição aveludada',
    post_processing_finish: 'Luz difusa, sombras suaves e texturas refinadas.',
  },

  'sensual-chiaroscuro': {
    category_slug: 'sensual',
    name: 'Chiaroscuro & Sombras',
    slug: 'chiaroscuro',
    artistic_direction: 'Jogo dramático de luz e sombra inspirado nos mestres da pintura clássica.',
    lighting_palette: 'Preto profundo e feixe único de luz direcional suave.',
    scene_environment: 'Estúdio escuro minimalista.',
    wardrobe_style: 'Tecidos recortados ou silhueta desenhada puramente pela sombra.',
    composition_notes: 'Contraste extremo valorizando contornos faciais e corporais.',
    atmosphere: 'Misteriosa, dramática e artística.',
    camera_preset: '85mm f/1.8 Studio Grid',
    depth_of_field: 'f/4.0 para definição de bordas iluminadas',
    post_processing_finish: 'Preto e branco com pretos densos e brancos brilhantes sem estourar.',
  },
};

export function getStyleProfile(categorySlug: string, styleSlug: string): StyleProfile {
  const key = `${categorySlug}-${styleSlug}`;
  if (STYLE_PROFILES[key]) return STYLE_PROFILES[key];

  // Fallback inteligente
  const fallback = Object.values(STYLE_PROFILES).find((s) => s.category_slug === categorySlug);
  if (fallback) return fallback;

  return {
    category_slug: categorySlug,
    name: 'Estúdio Editorial',
    slug: styleSlug,
    artistic_direction: 'Fotografia profissional com iluminação equilibrada de estúdio e nitidez de alta resolução.',
    lighting_palette: 'Tons neutros naturais com iluminação suave.',
    scene_environment: 'Estúdio moderno de fotografia com fundo elegante.',
    wardrobe_style: 'Vestuário nobre e harmonioso.',
    composition_notes: 'Composição centralizada e equilibrada com foco na expressão.',
    atmosphere: 'Elegante, profissional e atemporal.',
    camera_preset: '85mm f/1.4 Portrait Lens',
    depth_of_field: 'f/2.2',
    post_processing_finish: 'Acabamento de estúdio com fidelidade de cores e preservação de textura.',
  };
}
