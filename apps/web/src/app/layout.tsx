import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono, Spectral } from 'next/font/google';
import { getLocale } from 'next-intl/server';

import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const spectral = Spectral({
  variable: '--font-spectral',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Mário Mesquita',
  description: 'Senior Software Engineer — TypeScript, Node.js, React.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spectral.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
