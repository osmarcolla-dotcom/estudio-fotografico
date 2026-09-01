import {
  IdentityProfile,
  PhotoVariation,
  ShootCategoryTemplate,
  StyleProfile,
  ShootPlan,
} from '../types';
import { CATEGORY_TEMPLATES } from '../templates/categories';
import { getStyleProfile } from '../templates/styles';

function normalizeSlug(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos: á -> a, é -> e, etc.
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export interface PromptEngineInput {
  identityProfile: IdentityProfile;
  categorySlug: string;
  styleSlug: string;
  variation: PhotoVariation;
}

export class PromptEngine {
  static buildShootPlan(
    categorySlug: string,
    styleSlug: string,
    totalPhotos: number
  ): ShootPlan {
    const cleanCat = normalizeSlug(categorySlug);
    const cleanStyle = normalizeSlug(styleSlug);

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
        expression: i % 2 === 0 ? 'radiant joyful smile, confident festive expression' : 'serene and happy expression looking into camera',
      });
    }

    return {
      category_slug: cleanCat,
      style_slug: cleanStyle,
      total_photos: totalPhotos,
      coherence_guidelines: [
        'Preservar integralmente os traços faciais, olhos, nariz, boca e cabelo da foto de referência.',
        `Estilo: ${style.name} (${style.artistic_direction}).`,
        `Iluminação de estúdio profissional com alta fidelidade de textura de pele e elementos temáticos visíveis.`,
      ],
      variations,
    };
  }

  static buildImagePrompt(input: PromptEngineInput): {
    prompt: string;
    negativePrompt: string;
  } {
    const { identityProfile, categorySlug, styleSlug, variation } = input;
    const cleanCat = normalizeSlug(categorySlug);
    const cleanStyle = normalizeSlug(styleSlug);
    const style = getStyleProfile(cleanCat, cleanStyle);

    let themePrompt = '';

    if (cleanCat.includes('aniversario')) {
      const birthdayScenes = [
        'birthday photoshoot celebration, close-up portrait holding two golden numeral candle sparklers in front of camera with subtle smoke, wearing elegant luxury brown one-shoulder dress, warm studio lighting with soft bokeh background',
        'commercial birthday studio photoshoot, sitting elegantly on a studio cube next to a minimalist white tiered birthday cake with lit burning candles, holding a champagne glass, glamorous party dress, luxury studio backdrop with golden balloons on floor',
        'joyful birthday celebration portrait, holding lit golden number birthday candle with smoke, beautiful genuine smile, wearing luxury evening dress, warm studio glow, bokeh lights',
        'glamorous studio photoshoot, sitting elegantly holding a glass of champagne with white birthday cake on podium, golden metallic balloons, warm studio lighting, 8k commercial photography',
        'standing in a luxury studio wearing glamorous birthday evening gown, popping a champagne bottle with sparkling splash, golden confetti in the air, glowing festive background lights',
        'close-up studio portrait smiling happily beside a white frosted birthday cake with glowing burning candles, warm flattering illumination on face, natural skin texture, 8k commercial portrait',
      ];
      themePrompt = birthdayScenes[(variation.photo_index - 1) % birthdayScenes.length];
    } else if (cleanCat.includes('gravidez')) {
      const maternityScenes = [
        'maternity studio photoshoot, standing gracefully with hands gently resting on baby bump, wearing flowing silk maternity gown with sheer fabrics, soft warm studio lighting with sheer curtains backdrop',
        'side profile silhouette maternity portrait, highlighting pregnant belly curvature, delicate backlight halo on hair, minimalist studio aesthetic',
        'sitting comfortably on luxury velvet armchair in studio, holding pregnant belly with serene loving smile, warm natural window light',
        'artistic maternity portrait with ethereal chiffon fabric floating around pregnant body, golden hour studio lighting, elegant soft tones',
        'close-up detailed portrait touching baby bump with maternal smile, soft focus studio background, 8k commercial photography',
      ];
      themePrompt = maternityScenes[(variation.photo_index - 1) % maternityScenes.length];
    } else if (cleanCat.includes('casamento')) {
      const weddingScenes = [
        'luxury bridal wedding photoshoot, wearing exquisite white bridal gown with lace embroidery and veil, holding a bouquet of noble fresh flowers, cinematic romantic studio lighting',
        'close-up bridal portrait adjusting lace veil, elegant diamond jewelry, radiant gentle smile, soft glowing studio background',
        'full body bridal portrait in classic palace setting with marble columns and soft golden light, grand wedding dress with long train',
        'romantic three-quarter bridal portrait looking over shoulder, veil flowing gracefully, warm sunset light through windows',
      ];
      themePrompt = weddingScenes[(variation.photo_index - 1) % weddingScenes.length];
    } else if (cleanCat.includes('sensual')) {
      const boudoirScenes = [
        'fine art boudoir photography, wearing luxury silk lingerie and robe, relaxing on minimalist bed with white sheets, soft morning window light, subtle artistic shadows',
        'dramatic chiaroscuro portrait in dark studio, subtle directional light outlining body curves, sophisticated black and white aesthetic',
        'intimate luxury portrait sitting on velvet armchair, elegant posture with hair naturally styled, warm atmospheric studio lighting',
      ];
      themePrompt = boudoirScenes[(variation.photo_index - 1) % boudoirScenes.length];
    } else if (cleanCat.includes('debutante')) {
      const debutanteScenes = [
        'luxury 15th debutante birthday gala photoshoot, wearing grand ballgown with crystal embellishments, delicate tiara, palace setting with chandeliers',
        'modern fashion debutante portrait, sitting on marble stairs in glamorous party dress, stylish editorial magazine lighting',
      ];
      themePrompt = debutanteScenes[(variation.photo_index - 1) % debutanteScenes.length];
    } else {
      themePrompt = `${variation.pose_description}, ${variation.setting_scene}, wearing ${style.wardrobe_style}, ${variation.lighting_setup}`;
    }

    const prompt = `Award-winning high-end studio portrait photograph of the exact same subject with natural hair and facial features, ${themePrompt}, ${variation.framing}, shot on 85mm f/1.4 lens, 8k resolution, ultra-realistic skin texture, realistic eye reflections, commercial studio photography, perfect anatomy`;

    const negativePrompt = 'cartoon, illustration, 3d render, anime, painting, deformed face, bad anatomy, bad eyes, crossed eyes, extra fingers, blurry, low quality, duplicate, oversaturated, plastic skin, bad hands';

    return {
      prompt,
      negativePrompt,
    };
  }
}
