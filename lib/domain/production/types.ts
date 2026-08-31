import { Order } from '@/lib/types';

// Status do ciclo de vida da sessão fotográfica
export type PhotoSessionStatus =
  | 'PENDING'
  | 'ANALYZING'
  | 'PLANNING'
  | 'GENERATING'
  | 'UPSCALING'
  | 'VALIDATING'
  | 'PREVIEW_READY'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'REVISION_REQUESTED'
  | 'FAILED'
  | 'CANCELLED';

// Status individual de cada PhotoJob
export type PhotoJobStatus =
  | 'QUEUED'
  | 'GENERATING'
  | 'UPSCALING'
  | 'VALIDATING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVISION_REQUESTED'
  | 'CANCELLED';

// Perfil de Identidade Visual (preservação facial e características imutáveis)
export interface IdentityProfile {
  face_description: string;
  hair_description: string;
  skin_description: string;
  body_description: string;
  apparent_age: string;
  clothing_description?: string;
  distinctive_features: string[];
  source_image_reference: string;
  face_landmarks_summary?: string;
  gender_presentation?: string;
  lighting_in_source?: string;
}

// Análise técnica da foto original enviada
export interface ImageAnalysisResult {
  people_count: number;
  face_detected: boolean;
  face_confidence: number; // 0.0 a 1.0
  framing: 'close-up' | 'medium' | 'full-body' | 'unknown';
  orientation: 'portrait' | 'landscape' | 'square';
  lighting_quality: 'good' | 'harsh' | 'low-light' | 'diffuse';
  source_width: number;
  source_height: number;
  quality_issues: string[];
  identity_profile: IdentityProfile;
  recommendation: 'proceed' | 'warning' | 'reject';
}

// Variação individual para uma foto do plano
export interface PhotoVariation {
  photo_index: number;
  pose_description: string;
  framing: 'Primeiro Plano (Close-up)' | 'Plano Médio' | 'Plano Americano' | 'Corpo Inteiro' | 'Detalhe Artístico';
  setting_scene: string;
  lighting_setup: string;
  composition_rule: string;
  wardrobe: string;
  camera_angle: string;
  mood: string;
  aspect_ratio: '4:5' | '1:1' | '16:9';
  expression: string;
}

// Plano Diretor do Ensaio
export interface ShootPlan {
  category_slug: string;
  style_slug: string;
  total_photos: number;
  coherence_guidelines: string[];
  variations: PhotoVariation[];
}

// Template de Categoria de Ensaio
export interface ShootCategoryTemplate {
  name: string;
  slug: string;
  description: string;
  allowed_settings: string[];
  allowed_poses: string[];
  lighting_types: string[];
  framing_types: string[];
  consistency_instructions: string[];
  specific_rules: string[];
  max_variations: number;
}

// Perfil de Estilo Fotográfico
export interface StyleProfile {
  category_slug: string;
  name: string;
  slug: string;
  artistic_direction: string;
  lighting_palette: string;
  scene_environment: string;
  wardrobe_style: string;
  composition_notes: string;
  atmosphere: string;
  camera_preset: string; // Ex: "50mm f/1.4 Soft Studio"
  depth_of_field: string;
  post_processing_finish: string;
}

// Versão de uma fotografia (v1, v2, v3)
export interface PhotoVersion {
  id: string;
  photo_job_id: string;
  version_number: number;
  prompt_used: string;
  raw_image_url?: string;
  upscaled_image_url?: string;
  preview_image_url?: string;
  final_storage_path?: string;
  preview_storage_path?: string;
  source_width?: number;
  source_height?: number;
  final_width?: number;
  final_height?: number;
  upscale_provider?: string;
  upscale_model?: string;
  is_active: boolean;
  created_at: string;
}

// Job individual por fotografia
export interface PhotoJob {
  id: string;
  session_id: string;
  photo_index: number;
  status: PhotoJobStatus;
  variation: PhotoVariation;
  attempts: number;
  max_attempts: number;
  active_version?: PhotoVersion;
  versions: PhotoVersion[];
  last_error?: string | null;
  provider_job_id?: string;
  provider_name?: string;
  generation_cost_cents?: number;
  duration_ms?: number;
  created_at: string;
  updated_at: string;
}

// Sessão de Ensaio Fotográfico
export interface PhotoSession {
  id: string;
  order_id: string;
  customer_id: string;
  category_slug: string;
  style_slug: string;
  package_photo_count: number;
  identity_profile?: IdentityProfile | null;
  shoot_plan?: ShootPlan | null;
  status: PhotoSessionStatus;
  total_photos: number;
  completed_photos: number;
  failed_photos: number;
  photo_jobs: PhotoJob[];
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Log Estruturado de Observabilidade
export interface ProductionLog {
  id: string;
  session_id: string;
  photo_job_id?: string;
  photo_index?: number;
  provider: string;
  operation: 'ANALYZE' | 'PLAN' | 'GENERATE' | 'UPSCALE' | 'VALIDATE' | 'PREVIEW' | 'RETRY' | 'REVISION';
  status: 'STARTED' | 'SUCCESS' | 'FAILED' | 'RETRYING';
  duration_ms?: number;
  error?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Parâmetros de Geração de Imagem
export interface GenerateImageParams {
  sessionId: string;
  photoJobId: string;
  photoIndex: number;
  prompt: string;
  negativePrompt?: string;
  sourceImageUrl: string;
  identityProfile: IdentityProfile;
  variation: PhotoVariation;
  seed?: number;
  guidanceScale?: number;
  facePreservationWeight?: number;
}

// Resultado da Geração
export interface GenerationResult {
  success: boolean;
  providerJobId: string;
  imageUrl?: string;
  seed?: number;
  durationMs?: number;
  estimatedCostCents?: number;
  rawResponse?: Record<string, unknown>;
  errorMessage?: string;
}

// Parâmetros de Upscale
export interface UpscaleParams {
  imageUrl: string;
  targetResolution: '4K' | '8K' | 'UHD' | 'MAX';
  scaleFactor?: number;
  enhanceFaces?: boolean;
}

// Resultado de Upscale
export interface UpscaleResult {
  success: boolean;
  upscaledUrl?: string;
  sourceWidth: number;
  sourceHeight: number;
  finalWidth: number;
  finalHeight: number;
  provider: string;
  model: string;
  durationMs?: number;
  errorMessage?: string;
}

// Validação Técnica de Foto Gerada
export interface ValidationResult {
  isValid: boolean;
  width: number;
  height: number;
  aspectRatio: string;
  mimeType: string;
  fileSizeBytes: number;
  qualityScore: number; // 0.0 a 10.0
  issues: string[];
}
