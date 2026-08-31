import { createAdminClient } from '@/lib/supabase/admin';
import { SignedUrlOptions, StorageFile, StorageService } from './types';

export class SupabaseStorageService implements StorageService {
  async uploadFile(file: StorageFile): Promise<{ path: string; publicUrl?: string }> {
    const supabase = createAdminClient();
    if (!supabase || !file.buffer) {
      // Retorna path local/referência quando Supabase não estiver configurado
      return { path: file.path };
    }

    try {
      const { data, error } = await supabase.storage
        .from(file.bucket)
        .upload(file.path, file.buffer, {
          contentType: file.mimeType,
          upsert: true,
        });

      if (error) {
        console.error(`Erro no upload para o bucket ${file.bucket}:`, error);
        return { path: file.path };
      }

      return { path: data.path };
    } catch (err) {
      console.error('Falha no upload de arquivo:', err);
      return { path: file.path };
    }
  }

  async getSignedDownloadUrl(options: SignedUrlOptions): Promise<string | null> {
    const supabase = createAdminClient();
    if (!supabase) {
      // Fallback para ambiente local/desenvolvimento sem bucket configurado
      return `/api/download/mock/${options.path}`;
    }

    try {
      const expiresIn = options.expiresInSeconds || 3600; // 1 hora padrão
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .createSignedUrl(options.path, expiresIn, {
          download: true,
        });

      if (error || !data?.signedUrl) {
        console.error('Erro ao gerar URL assinada:', error);
        return null;
      }

      return data.signedUrl;
    } catch (err) {
      console.error('Falha ao gerar URL de download:', err);
      return null;
    }
  }

  async deleteFile(bucket: string, path: string): Promise<boolean> {
    const supabase = createAdminClient();
    if (!supabase) return true;

    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      return !error;
    } catch {
      return false;
    }
  }
}
