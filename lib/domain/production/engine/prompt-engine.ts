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
    const category = CATEGORY_TEMPLATES[categorySlug] || CATEGORY_TEMPLATES['gravidez'];
    const style = getStyleProfile(categorySlug, styleSlug);

    const framings: PhotoVariation['framing'][] = [
      'Plano Médio',
      'Corpo Inteiro',
      'Primeiro Plano (Close-up)',
      'Plano Americano',
      'Detalhe Artístico',
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
        composition_rule: i % 2 === 0 ? 'Regra dos terços com espaço negativo elegante' : 'Composição centralizada com linhas de fuga nobres',
        wardrobe: style.wardrobe_style,
        camera_angle: i % 3 === 0 ? 'Ligeiro contra-plongée (ângulo inferior sutil e imponente)' : 'Nível dos olhos com perspectiva natural de 50mm/85mm',
        mood: style.atmosphere,
        aspect_ratio: '4:5',
        expression: i % 3 === 0 ? 'Olhar sereno e contemplativo no horizonte' : 'Sorriso acolhedor, natural e espontâneo olhando para a lente',
      });
    }

    return {
      category_slug: categorySlug,
      style_slug: styleSlug,
      total_photos: totalPhotos,
      coherence_guidelines: [
        'Manter preservação facial e traços físicos idênticos da pessoa original.',
        `Seguir rigorosamente o estilo visual: ${style.name} (${style.artistic_direction}).`,
        `Profundidade de campo e câmera: ${style.camera_preset}.`,
        `Pós-produção e acabamento de cor: ${style.post_processing_finish}.`,
      ],
      variations,
    };
  }

  /**
   * Monta o prompt técnico interno combinando:
   * IDENTIDADE (prioridade máxima) > ESTILO > VARIAÇÃO DA FOTO
   * O cliente nunca visualiza esse prompt.
   */
  static buildImagePrompt(input: PromptEngineInput): {
    prompt: string;
    negativePrompt: string;
  } {
    const { identityProfile, categorySlug, styleSlug, variation } = input;
    const category = CATEGORY_TEMPLATES[categorySlug] || CATEGORY_TEMPLATES['gravidez'];
    const style = getStyleProfile(categorySlug, styleSlug);

    // 1. Identidade (Traços inalteráveis)
    const identityBlock = [
      `Masterpiece studio portrait of the exact same subject with: ${identityProfile.face_description}.`,
      `Hair characteristics: ${identityProfile.hair_description}.`,
      `Skin tone and natural texture: ${identityProfile.skin_description}.`,
      identityProfile.apparent_age ? `Apparent age: ${identityProfile.apparent_age}.` : '',
      identityProfile.distinctive_features && identityProfile.distinctive_features.length > 0
        ? `Distinctive features preserved: ${identityProfile.distinctive_features.join(', ')}.`
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    // 2. Variação de Composição e Enquadramento
    const variationBlock = [
      `Framing: ${variation.framing}.`,
      `Pose: ${variation.pose_description}.`,
      `Setting and Environment: ${variation.setting_scene}.`,
      `Lighting: ${variation.lighting_setup}.`,
      `Wardrobe: ${variation.wardrobe}.`,
      `Expression: ${variation.expression}.`,
      `Camera perspective: ${variation.camera_angle}, ${variation.composition_rule}.`,
    ].join(' ');

    // 3. Estilo e Direção Fotográfica
    const styleBlock = [
      `Photography style: ${style.artistic_direction}.`,
      `Atmosphere: ${style.atmosphere}.`,
      `Camera & Lens setup: ${style.camera_preset}, ${style.depth_of_field}.`,
      `Finish: ${style.post_processing_finish}.`,
      `8k uhd, extremely detailed skin pores, realistic eyes reflection, award winning commercial studio photography, perfect anatomy.`,
    ].join(' ');

    const prompt = `${identityBlock}\n\n${variationBlock}\n\n${styleBlock}`;

    // Negative Prompt rigoroso para garantir alta fidelidade
    const negativePrompt = [
      'deformed face, deformed fingers, extra limbs, bad anatomy, mutated hands, poorly drawn face',
      'plastic skin, fake smooth skin, oversaturated, cartoon, 3d render, illustration, drawing',
      'blurry, out of focus, low resolution, artifacts, watermark, text, signature, duplicate face',
      'distorted proportions, crossed eyes, bad eyes, unnatural lighting, harsh flash reflection',
    ].join(', ');

    return {
      prompt,
      negativePrompt,
    };
  }
}
