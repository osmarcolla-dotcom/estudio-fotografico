import {
  IdentityProfile,
  PhotoVariation,
  ShootCategoryTemplate,
  StyleProfile,
  ShootPlan,
} from '../types';
import { CATEGORY_TEMPLATES } from '../templates/categories';
import { getStyleProfile } from '../templates/styles';

export interface PromptEngineInput {
  identityProfile: IdentityProfile;
  categorySlug: string;
  styleSlug: string;
  variation: PhotoVariation;
}

export class PromptEngine {
  /**
   * Constrói o plano diretor de fotos (ShootPlan) distribuindo variações ricas
   * de poses, enquadramentos, cenários e iluminação para garantir variedade e coerência.
   */
  static buildShootPlan(
    categorySlug: string,
    styleSlug: string,
    totalPhotos: number
  ): ShootPlan {
    const cleanCat = categorySlug.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const cleanStyle = styleSlug.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const category = CATEGORY_TEMPLATES[cleanCat] || CATEGORY_TEMPLATES['aniversario'] || CATEGORY_TEMPLATES['gravidez'];
    const style = getStyleProfile(cleanCat, cleanStyle);

    const framings: PhotoVariation['framing'][] = [
      'Primeiro Plano (Close-up)',
      'Plano Médio',
      'Corpo Inteiro',
      'Plano Americano',
      'Detalhe Artístico',
      'Plano Médio',
    ];

    const variations: PhotoVariation[] = [];

    for (let i = 1; i <= totalPhotos; i++) {
      const framing = framings[(i - 1) % framings.length];
      const pose = category.allowed_poses[(i - 1) % category.allowed_poses.length];
      const setting = category.allowed_settings[(i - 1) % category.allowed_settings.length];
      const lighting = category.lighting_types[(i - 1) % category.lighting_types.length];

      variations.push({
        photo_index: i,
        pose_description: `${pose}`,
        framing,
        setting_scene: `${setting}`,
        lighting_setup: `${lighting}. ${style.lighting_palette}`,
        composition_rule: i % 2 === 0 ? 'rule of thirds, clean luxury depth of field' : 'centered symmetrical composition, dramatic studio lighting',
        wardrobe: style.wardrobe_style,
        camera_angle: i % 3 === 0 ? 'eye level, natural 85mm lens perspective' : 'three-quarter profile angle, flattering studio perspective',
        mood: style.atmosphere,
        aspect_ratio: '4:5',
        expression: i % 2 === 0 ? 'confident gentle smile, radiant happy expression, looking into camera' : 'serene and joyful expression, elegant look',
      });
    }

    return {
      category_slug: cleanCat,
      style_slug: cleanStyle,
      total_photos: totalPhotos,
      coherence_guidelines: [
        'Preservar integralmente os traços faciais, olhos, nariz, boca e cabelo da foto de referência.',
        `Estilo: ${style.name} (${style.artistic_direction}).`,
        `Iluminação de estúdio profissional com alta fidelidade de textura de pele.`,
      ],
      variations,
    };
  }

  /**
   * Monta o prompt técnico interno ultra-realista para o modelo Flux PuLID.
   */
  static buildImagePrompt(input: PromptEngineInput): {
    prompt: string;
    negativePrompt: string;
  } {
    const { identityProfile, categorySlug, styleSlug, variation } = input;
    const cleanCat = categorySlug.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const cleanStyle = styleSlug.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const style = getStyleProfile(cleanCat, cleanStyle);

    // Constrói descrição fotográfica de estúdio ultra-realista
    let themePrompt = '';

    if (cleanCat.includes('aniversario')) {
      const birthdayProps = [
        'holding sparkling golden birthday number candles, elegant celebration studio lighting with warm glowing bokeh',
        'sitting elegantly beside a luxury minimalist birthday cake with lit candles, champagne glass on table, luxury celebration',
        'joyfully celebrating birthday photoshoot, glamorous luxury party dress, golden metallic balloons in background, warm studio glow',
        'holding champagne bottle celebrating, beautiful smile, glamorous studio portrait, soft warm golden lighting, high-end magazine photoshoot',
        'standing with elegant birthday celebration styling, sparkling background bokeh, glamorous makeup and styling',
        'close-up portrait smiling beside birthday candles, warm soft illumination on face, natural skin texture, 8k commercial photography',
      ];
      themePrompt = birthdayProps[(variation.photo_index - 1) % birthdayProps.length];
    } else if (cleanCat.includes('gravidez')) {
      themePrompt = `maternity photoshoot, ${variation.pose_description}, wearing ${style.wardrobe_style}, ${variation.setting_scene}, soft natural studio illumination`;
    } else if (cleanCat.includes('casamento')) {
      themePrompt = `luxury wedding bridal photoshoot, wearing magnificent bridal wedding gown with intricate details, ${variation.setting_scene}, cinematic romantic studio lighting`;
    } else if (cleanCat.includes('sensual')) {
      themePrompt = `boudoir fine art photography, ${variation.pose_description}, ${style.wardrobe_style}, ${variation.setting_scene}, dramatic chiaroscuro soft window lighting`;
    } else {
      themePrompt = `${variation.pose_description}, ${variation.setting_scene}, wearing ${style.wardrobe_style}, ${variation.lighting_setup}`;
    }

    const prompt = `Award-winning high-end studio portrait photograph of the subject, ${themePrompt}, ${variation.framing}, ${variation.expression}, ${style.camera_preset}, shot on 85mm f/1.4 lens, 8k resolution, ultra-realistic skin texture, realistic eye reflections, photorealistic commercial studio photography, perfect anatomy`;

    const negativePrompt = 'cartoon, illustration, 3d render, anime, painting, deformed face, bad anatomy, bad eyes, crossed eyes, extra fingers, blurry, low quality, duplicate, oversaturated, plastic skin';

    return {
      prompt,
      negativePrompt,
    };
  }
}
