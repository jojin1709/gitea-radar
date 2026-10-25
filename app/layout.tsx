import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

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
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-dark-bg text-slate-100 antialiased selection:bg-radar-500/30 selection:text-radar-200">
        <div className="relative min-h-screen flex flex-col">
          {/* Subtle radar ambient glow */}
          <div className="pointer-events-none fixed inset-0 z-0 radar-grid opacity-30" />
          <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 radar-glow z-0" />
          
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
