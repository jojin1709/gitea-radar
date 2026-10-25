import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Gitea Radar — Discover What Developers Are Building',
    template: '%s | Gitea Radar',
  },
  description: 'The premier open-source discovery platform for the Gitea ecosystem. Explore trending repositories, rising developers, and emerging software.',
  keywords: ['gitea', 'open source', 'git', 'repositories', 'trending', 'developer tools', 'discovery'],
  authors: [{ name: 'Gitea Radar Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gitea-radar.vercel.app'),
  openGraph: {
    title: 'Gitea Radar — Discover What Developers Are Building',
    description: 'Explore trending repositories, fastest growing projects, and emerging software in the Gitea ecosystem.',
    url: 'https://gitea-radar.vercel.app',
    siteName: 'Gitea Radar',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gitea Radar — Discover What Developers Are Building',
    description: 'Explore trending repositories, fastest growing projects, and emerging software in the Gitea ecosystem.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-dark-bg text-slate-100 antialiased font-sans selection:bg-radar-500/25 selection:text-radar-200">
        <div className="relative min-h-screen flex flex-col">
          {/* Engineering grid and subtle ambient horizon */}
          <div className="pointer-events-none fixed inset-0 z-0 radar-grid opacity-25" />
          <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 radar-glow z-0" />
          
          <Header />
          <main className="relative z-10 flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
