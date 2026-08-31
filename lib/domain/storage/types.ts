export interface StorageFile {
  bucket: 'customer-uploads' | 'previews' | 'final-images';
  path: string;
  buffer?: Buffer;
  mimeType: string;
}

export interface SignedUrlOptions {
  bucket: 'customer-uploads' | 'previews' | 'final-images';
  path: string;
  expiresInSeconds?: number;
}

export interface StorageService {
  uploadFile(file: StorageFile): Promise<{ path: string; publicUrl?: string }>;
  getSignedDownloadUrl(options: SignedUrlOptions): Promise<string | null>;
  deleteFile(bucket: string, path: string): Promise<boolean>;
}
