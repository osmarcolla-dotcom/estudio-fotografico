import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { createAdminClient } from '@/lib/supabase/admin';

const DOWNLOAD_TIMEOUT_MS = 20_000;

type DownloadablePhoto = {
  photo_index: number;
  final_storage_path?: string | null;
  preview_storage_path?: string | null;
};

type DownloadableOrder = {
  order_number: string;
  status: string;
  produced_photos: DownloadablePhoto[];
};

function normalizeStoragePath(value: string, bucket: string): string {
  return value
    .replace(/^\/+/, '')
    .replace(new RegExp(`^${bucket}/`), '');
}

function extensionForContentType(contentType: string | null | undefined): string {
  const type = contentType?.toLowerCase().split(';')[0];
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/heic') return 'heic';
  return 'jpg';
}

function isRemoteUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('http://');
}

async function fetchRemoteImage(
  url: string,
  signal: AbortSignal
): Promise<{ bytes: Uint8Array; extension: string } | null> {
  if (!isRemoteUrl(url)) return null;

  const response = await fetch(url, {
    signal,
    headers: { Accept: 'image/*' },
  });

  if (!response.ok) return null;

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength === 0) return null;

  return {
    bytes,
    extension: extensionForContentType(response.headers.get('content-type')),
  };
}

async function downloadFromPrivateStorage(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  path: string
): Promise<{ bytes: Uint8Array; extension: string } | null> {
  const storagePath = normalizeStoragePath(path, 'final-images');
  const { data: file, error } = await supabase.storage
    .from('final-images')
    .download(storagePath);

  if (error || !file) return null;

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.byteLength === 0) return null;

  return {
    bytes,
    extension: extensionForContentType(file.type),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Armazenamento do estúdio não está configurado.' },
        { status: 503 }
      );
    }

    // O token é a única forma de localizar o pedido. Nunca aceitar apenas um ID na URL.
    const { data: linkData, error: linkError } = await supabase
      .from('approval_links')
      .select('id, token, expires_at, order:orders(order_number, status, produced_photos(*))')
      .eq('token', token)
      .maybeSingle();

    if (linkError || !linkData || !linkData.order) {
      return NextResponse.json(
        { success: false, message: 'Link de download inválido ou expirado.' },
        { status: 404 }
      );
    }

    if (linkData.expires_at && new Date(linkData.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: 'Este link de download expirou.' },
        { status: 410 }
      );
    }

    const order = linkData.order as unknown as DownloadableOrder;

    // Arquivos finais só podem ser baixados após aprovação do pedido.
    if (order.status !== 'APPROVED' && order.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, message: 'O download será liberado depois que o ensaio for aprovado.' },
        { status: 403 }
      );
    }

    const producedPhotos = [...(order.produced_photos || [])].sort(
      (a, b) => a.photo_index - b.photo_index
    );

    if (producedPhotos.length === 0) {
      return NextResponse.json(
        { success: false, message: 'As fotos deste ensaio ainda não estão disponíveis.' },
        { status: 409 }
      );
    }

    const zip = new JSZip();
    const folder = zip.folder(`Ensaio_${order.order_number || 'fotografico'}`);
    const fileResults = await Promise.allSettled(
      producedPhotos.map(async (photo) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

        try {
          let file: { bytes: Uint8Array; extension: string } | null = null;

          // Produções reais gravadas no bucket privado final-images.
          if (photo.final_storage_path) {
            file = isRemoteUrl(photo.final_storage_path)
              ? await fetchRemoteImage(photo.final_storage_path, controller.signal)
              : await downloadFromPrivateStorage(supabase, photo.final_storage_path);
          }

          // Compatibilidade com registros antigos de demonstração: quando o final ainda
          // não existe no bucket, inclui a prévia HTTP disponível em vez de criar ZIP vazio.
          if (!file && photo.preview_storage_path) {
            file = await fetchRemoteImage(photo.preview_storage_path, controller.signal);
          }

          if (!file || file.bytes.byteLength === 0) return null;

          return {
            index: photo.photo_index,
            bytes: file.bytes,
            extension: file.extension,
          };
        } finally {
          clearTimeout(timeout);
        }
      })
    );

    let addedFiles = 0;
    for (const result of fileResults) {
      if (result.status !== 'fulfilled' || !result.value || !folder) continue;

      const file = result.value;
      folder.file(
        `Foto_${String(file.index).padStart(2, '0')}_Alta_Resolucao.${file.extension}`,
        file.bytes
      );
      addedFiles += 1;
    }

    if (addedFiles === 0) {
      return NextResponse.json(
        { success: false, message: 'Não foi possível localizar os arquivos das fotos. Tente novamente em instantes.' },
        { status: 424 }
      );
    }

    const zipBytes = await zip.generateAsync({
      type: 'uint8array',
      compression: 'STORE',
    });

    return new Response(zipBytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="Ensaio_${order.order_number || 'fotografico'}.zip"`,
        'Content-Length': String(zipBytes.byteLength),
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Erro na rota de download:', error);
    return NextResponse.json(
      { success: false, message: 'Não foi possível preparar o download agora.' },
      { status: 500 }
    );
  }
}
