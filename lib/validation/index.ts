import { z } from 'zod';

export const customerDataSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  whatsapp: z
    .string()
    .min(10, 'Informe um número de WhatsApp válido com DDD')
    .max(20, 'Número de WhatsApp inválido')
    .regex(/^[\d\s()+-]+$/, 'Formato de WhatsApp inválido'),
  email: z
    .string()
    .email('Informe um e-mail válido'),
});

export const orderCreationSchema = z.object({
  customer: customerDataSchema,
  categoryId: z.string().uuid('Categoria inválida'),
  styleId: z.string().uuid('Estilo inválido'),
  packageId: z.string().uuid('Pacote inválido'),
  notes: z.string().max(500, 'Observação deve ter no máximo 500 caracteres').optional(),
  uploadedPhotos: z.array(
    z.object({
      fileName: z.string(),
      fileSize: z.number().max(25 * 1024 * 1024, 'Cada foto deve ter até 25MB'),
      mimeType: z.string().regex(/^image\/(jpeg|png|webp|heic|heif)$/i, 'Formato de imagem não suportado. Use JPG, PNG ou WEBP'),
      base64Data: z.string().optional(),
      storagePath: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
  ).min(1, 'Envie pelo menos 1 foto nítida da pessoa'),
});

export const revisionRequestSchema = z.object({
  producedPhotoId: z.string().uuid('Foto inválida').optional(),
  photoIndex: z.number().int().min(1).optional(),
  reason: z
    .string()
    .min(3, 'Informe o motivo do ajuste')
    .max(100, 'Motivo deve ser conciso'),
  comment: z
    .string()
    .max(500, 'Comentário deve ter no máximo 500 caracteres')
    .optional(),
});

export const catalogPackageSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  slug: z.string().min(2, 'Slug é obrigatório'),
  description: z.string().optional(),
  photoCount: z.number().int().min(1, 'Quantidade mínima é 1 foto'),
  priceCents: z.number().int().min(0, 'Preço não pode ser negativo'),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const catalogCategorySchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  slug: z.string().min(2, 'Slug é obrigatório'),
  description: z.string().min(5, 'Descrição é obrigatória'),
  sampleImageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const catalogStyleSchema = z.object({
  categoryId: z.string().uuid('Categoria obrigatória'),
  name: z.string().min(2, 'Nome é obrigatório'),
  slug: z.string().min(2, 'Slug é obrigatório'),
  description: z.string().optional(),
  sampleImageUrl: z.string().optional(),
  promptPreset: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'PAID',
    'PRODUCTION_QUEUED',
    'IN_PRODUCTION',
    'READY_FOR_APPROVAL',
    'REVISION_REQUESTED',
    'APPROVED',
    'COMPLETED',
    'CANCELLED',
  ]),
  notes: z.string().optional(),
});

export type CustomerDataInput = z.infer<typeof customerDataSchema>;
export type OrderCreationInput = z.infer<typeof orderCreationSchema>;
export type RevisionRequestInput = z.infer<typeof revisionRequestSchema>;
