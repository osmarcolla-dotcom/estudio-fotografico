import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#17212B',
};

export const metadata: Metadata = {
  title: 'Estúdio Fotográfico Digital — Ensaios Personalizados em Alta Resolução',
  description:
    'Transforme sua ideia em um ensaio fotográfico exclusivo, produzido especialmente para você com acabamento profissional e alta definição.',
  keywords: [
    'ensaio fotográfico',
    'estúdio fotográfico digital',
    'fotos em alta resolução',
    'ensaio gestante',
    'ensaio casamento',
    'fotografia profissional',
  ],
  authors: [{ name: 'Estúdio Fotográfico Digital' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#17212B] antialiased selection:bg-[#315B52] selection:text-[#FFFDF9]">
        {children}
      </body>
    </html>
  );
}
