import { ShootCategoryTemplate } from '../types';

export const CATEGORY_TEMPLATES: Record<string, ShootCategoryTemplate> = {
  gravidez: {
    name: 'Gravidez & Maternidade',
    slug: 'gravidez',
    description: 'Retratos sublimes que celebram a gestação com delicadeza, foco no ventre e iluminação suave.',
    allowed_settings: [
      'Estúdio clean com cortinas translúcidas e luz natural suave',
      'Fundo infinito escuro com contraluz marcante delineando a silhueta',
      'Jardim botânico com luz dourada de entardecer e folhagens nobres',
      'Cenário minimalista com tecidos esvoaçantes de seda e linho cru',
      'Ambiente costeiro ao pôr do sol com brisa suave e tons quentes',
    ],
    allowed_poses: [
      'Mãos repousadas delicadamente sobre o ventre com olhar sereno',
      'Silhueta de perfil destacando a curvatura da gravidez',
      'Plano médio em três quartos com sorriso acolhedor e contemplativo',
      'Sentada confortavelmente em poltrona nobre com pose relaxada e elegante',
      'Em pé com tecido fluido ao vento e postura graciosa',
    ],
    lighting_types: [
      'Luz difusa de estúdio (softbox grande) com preenchimento sutil',
      'Contraluz dourado (golden hour) criando halo sutil nos cabelos',
      'Chiaroscuro suave com janela lateral e sombras aveludadas',
    ],
    framing_types: [
      'Primeiro Plano (Close-up)',
      'Plano Médio',
      'Plano Americano',
      'Corpo Inteiro',
      'Detalhe Artístico',
    ],
    consistency_instructions: [
      'Preservar integralmente formato do rosto, olhos, boca, tom de pele e textura do cabelo da foto original.',
      'Manter a mesma paleta de tons suaves e iluminação contínua em todo o ensaio.',
      'Garantir proporções naturais e harmoniosas do corpo e da gestação.',
    ],
    specific_rules: [
      'Evitar fundos poluídos ou elementos de distração.',
      'Garantir que os tecidos e vestidos tenham caimento fluido e realista.',
    ],
    max_variations: 30,
  },

  casamento: {
    name: 'Casamento & Noivos',
    slug: 'casamento',
    description: 'Momentos atemporais, alta costura, composições cinematográficas e elegância absoluta.',
    allowed_settings: [
      'Salão arquitetônico clássico com vitrais e colunas imponentes',
      'Jardim de mansão histórica com gazebo florido e luz suave',
      'Estúdio editorial com iluminação de alta moda e fundo nobre',
      'Cenário costeiro com vista panorâmica do mar e véu ao vento',
      'Escadaria palaciana em mármore com iluminação dramática',
    ],
    allowed_poses: [
      'Pose editorial clássica olhando serenamente para a câmera',
      'Ajuste sutil do véu ou grinalda com elegância refinada',
      'Perfil clássico de noiva com postura ereta e olhar no horizonte',
      'Plano médio segurando buquê de flores nobres com delicadeza',
      'Corpo inteiro com caimento impecável do vestido e calda',
    ],
    lighting_types: [
      'Iluminação cinematográfica com luz principal suave e luz de contorno',
      'Luz natural filtrada por vitrais e janelas amplas',
      'Luz pontual suave com bokeh elegante ao fundo',
    ],
    framing_types: [
      'Primeiro Plano (Close-up)',
      'Plano Médio',
      'Plano Americano',
      'Corpo Inteiro',
      'Detalhe Artístico',
    ],
    consistency_instructions: [
      'Preservação rigorosa dos traços faciais, expressão e características físicas da noiva/noivo.',
      'Harmonia estética do vestido e acessórios ao longo de todas as fotos.',
    ],
    specific_rules: [
      'Vestidos e ternos com texturas ricas (renda, cetim, bordados finos).',
      'Expressão calma, sofisticada e romântica.',
    ],
    max_variations: 30,
  },

  aniversario: {
    name: 'Aniversário & Celebração',
    slug: 'aniversario',
    description: 'Ensaios festivos, vibrantes e glamourosos com estética editorial de celebração.',
    allowed_settings: [
      'Estúdio glam com balões metálicos cromados, confetes dourados e taça de champanhe',
      'Fundo neutro escovado com iluminação colorida suave e bolo artístico decorado',
      'Cenário urbano sofisticado à noite com luzes de cidade ao fundo (bokeh)',
      'Lounge contemporâneo com mobiliário de design e iluminação quente',
    ],
    allowed_poses: [
      'Pose alegre e descontraída brindando com taça de cristal',
      'Sentada junto a bolo comemorativo com olhar radiante',
      'Pose dinâmica jogando confetes dourados com expressão espontânea',
      'Retrato de busto elegante com sorriso autêntico e confiante',
      'Corpo inteiro com look de festa sofisticado e postura expressiva',
    ],
    lighting_types: [
      'Iluminação de passarela vibrante com preenchimento limpo',
      'Luzes pontuais quentes criando reflexos nos elementos festivos',
      'Contraste moderno com sombras bem definidas e nitidez nos olhos',
    ],
    framing_types: [
      'Primeiro Plano (Close-up)',
      'Plano Médio',
      'Plano Americano',
      'Corpo Inteiro',
      'Detalhe Artístico',
    ],
    consistency_instructions: [
      'Manter a identidade da pessoa inalterada mesmo em diferentes expressões festivas.',
      'Garantir consistência no penteado, maquiagem e estilo escolhido.',
    ],
    specific_rules: [
      'Evitar caricaturas ou exageros em balões; manter a sofisticação visual.',
    ],
    max_variations: 30,
  },

  debutante: {
    name: 'Debutante (15 Anos)',
    slug: 'debutante',
    description: 'A magia e a transição dos 15 anos traduzidas em moda, sofisticação e conto de fadas moderno.',
    allowed_settings: [
      'Palácio moderno com espelhos, lustres de cristal e chão espelhado',
      'Jardim encantado com arco de rosas e luz de penumbra dourada',
      'Estúdio de moda editorial com iluminação de revista internacional',
      'Escadaria monumental com iluminação de gala',
    ],
    allowed_poses: [
      'Pose de gala segurando a barra do vestido com postura nobre',
      'Close-up com tiara delicada e olhar confiante e doce',
      'Giro suave com movimento esvoaçante da saia de tule',
      'Sentada em degrau de mármore com pose moderna e sofisticada',
    ],
    lighting_types: [
      'Beauty lighting com softbox frontal e contraluz sutil',
      'Luz etérea difusa com leve brilho nos tecidos',
      'Iluminação dramática de teatro com foco direcionado',
    ],
    framing_types: [
      'Primeiro Plano (Close-up)',
      'Plano Médio',
      'Plano Americano',
      'Corpo Inteiro',
      'Detalhe Artístico',
    ],
    consistency_instructions: [
      'Preservação exata da idade aparente, formato do rosto e traços da debutante.',
    ],
    specific_rules: [
      'Vestidos de 15 anos com riqueza de tecidos (tule, cristais, pedrarias).',
    ],
    max_variations: 30,
  },

  'recem-nascido': {
    name: 'Recém-nascido & Newborn',
    slug: 'recem-nascido',
    description: 'Ternura, segurança e delicadeza extrema com foco nas feições doces do bebê.',
    allowed_settings: [
      'Ninho acolhedor de lã merino e tecidos antialérgicos em tons crus',
      'Cestinho de madeira rústica com mantas macias e luz lateral suave',
      'Fundo infinito branco puro com pose enroladinha (wrap macio)',
      'Cama king com edredom de plumas em quarto com luz matinal',
    ],
    allowed_poses: [
      'Bebê dormindo tranquilamente enrolado em wrap de algodão macio',
      'Close-up dos detalhes: mãozinhas, pezinhos e bochechas serenas',
      'Deitadinho de bruços com queixo apoiado nas mãozinhas macias',
      'Apoiado em ninho fofo com gorrinho de tricô delicado',
    ],
    lighting_types: [
      'Luz natural de janela grande com difusor gigante extremamente suave',
      'Luz contínua de baixa intensidade e temperatura quente',
    ],
    framing_types: [
      'Primeiro Plano (Close-up)',
      'Plano Médio',
      'Detalhe Artístico',
    ],
    consistency_instructions: [
      'Preservação rigorosa dos traços fofos, formato do nariz, boquinha e tom de pele do bebê.',
    ],
    specific_rules: [
      'Sem poses artificiais ou forçadas; sempre conforto e naturalidade.',
    ],
    max_variations: 30,
  },

  mesversario: {
    name: 'Mêsversário & Bebê',
    slug: 'mesversario',
    description: 'Acompanhamento do crescimento mês a mês em composições lúdicas e temáticas.',
    allowed_settings: [
      'Tapete temático com número floral do mês e brinquedos clássicos de madeira',
      'Cenário pastel boho com almofadas em formato de lua e estrelas',
      'Estúdio minimalista com balão do número correspondente ao mês',
    ],
    allowed_poses: [
      'Bebê sentado com brinquedo de madeira e sorriso curioso',
      'Engatinhando em direção à câmera com expressão alegre',
      'Deitadinho de costas segurando os próprios pezinhos',
      'Olhando surpreso e encantado para balão temático',
    ],
    lighting_types: [
      'Luz ampla, homogênea e alegre de estúdio',
      'Luz natural difusa sem sombras duras',
    ],
    framing_types: [
      'Primeiro Plano (Close-up)',
      'Plano Médio',
      'Corpo Inteiro',
    ],
    consistency_instructions: [
      'Preservação fidedigna das características faciais e expressividade do bebê.',
    ],
    specific_rules: [
      'Cores alegres e harmoniosas em tons pastéis ou vibrantes suaves.',
    ],
    max_variations: 30,
  },

  sensual: {
    name: 'Sensual & Boudoir',
    slug: 'sensual',
    description: 'Fotografia intimista, empoderamento, jogo sutil de sombras e alta sofisticação estética.',
    allowed_settings: [
      'Suíte de luxo com cama minimalista em lençóis brancos e luz de janela matinal',
      'Estúdio escovado com jogo de luz chiaroscuro e contraluz dramático',
      'Poltrona de veludo nobre com iluminação pontual e atmosfera intimista',
      'Espaço com cortinas de seda fluida e reflexos dourados',
    ],
    allowed_poses: [
      'Pose relaxada na cama com olhar enigmático e postura elegante',
      'Silhueta de perfil junto à janela com iluminação recortada',
      'Busto com cabelo sutilmente despojado e olhar marcante para a lente',
      'Deitada de lado com postura natural e jogo de sombras nas curvas',
    ],
    lighting_types: [
      'Luz de janela lateral com sombras suaves e alto contraste artístico',
      'Contraluz dourado criando recorte de silhueta',
      'Iluminação Rembrandt com ponto de luz focado no olhar',
    ],
    framing_types: [
      'Primeiro Plano (Close-up)',
      'Plano Médio',
      'Plano Americano',
      'Corpo Inteiro',
      'Detalhe Artístico',
    ],
    consistency_instructions: [
      'Preservação total da fisionomia, corpo, traços faciais, marcas e identidade da pessoa.',
      'Elegância estética e respeito à privacidade.',
    ],
    specific_rules: [
      'Fotografia artística, sensual e de bom gosto, sem vulgaridade.',
      'Priorizar tecidos nobres como seda, renda e veludo.',
    ],
    max_variations: 30,
  },
};
