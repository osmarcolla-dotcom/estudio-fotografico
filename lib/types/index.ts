export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PRODUCTION_QUEUED'
  | 'IN_PRODUCTION'
  | 'READY_FOR_APPROVAL'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export type ProductionJobStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type UserRole = 'ADMIN' | 'STAFF';

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sample_image_url?: string | null;
  display_order: number;
  is_active: boolean;
  styles?: Style[];
  created_at?: string;
  updated_at?: string;
}

export interface Style {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string | null;
  sample_image_url?: string | null;
  prompt_preset?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  photo_count: number;
  price_cents: number;
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  category_id: string;
  style_id: string;
  package_id: string;

  // Dados congelados
  package_name: string;
  package_photo_count: number;
  package_price_cents: number;
  category_name: string;
  style_name: string;

  status: OrderStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;

  // Relacionamentos carregados
  customer?: Customer;
  category?: Category;
  style?: Style;
  package?: Package;
  payment?: Payment;
  customer_photos?: CustomerPhoto[];
  produced_photos?: ProducedPhoto[];
  approval_link?: ApprovalLink;
  production_jobs?: ProductionJob[];
  revision_requests?: RevisionRequest[];
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  transaction_id?: string | null;
  amount_cents: number;
  status: PaymentStatus;
  payment_method?: string | null;
  paid_at?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CustomerPhoto {
  id: string;
  order_id: string;
  storage_path: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  width?: number | null;
  height?: number | null;
  created_at: string;
}

export interface ApprovalLink {
  id: string;
  order_id: string;
  token: string;
  expires_at?: string | null;
  view_count: number;
  approved_at?: string | null;
  created_at: string;
}

export interface ProducedPhoto {
  id: string;
  order_id: string;
  photo_index: number;
  preview_storage_path: string;
  final_storage_path: string;
  variation_description?: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductionJob {
  id: string;
  order_id: string;
  provider: string;
  status: ProductionJobStatus;
  parameters?: Record<string, unknown>;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RevisionRequest {
  id: string;
  order_id: string;
  produced_photo_id?: string | null;
  photo_index?: number | null;
  reason: string;
  comment?: string | null;
  is_resolved: boolean;
  resolved_at?: string | null;
  created_at: string;
}

export interface DashboardMetrics {
  total_orders: number;
  pending_payments: number;
  in_production: number;
  ready_for_approval: number;
  approved_orders: number;
  revision_requests: number;
  total_revenue_cents: number;
}
