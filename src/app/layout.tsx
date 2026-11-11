import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: 'Reel Good',
    template: '%s | Reel Good',
  },
  description: 'Discover movies and keep track of your favorites.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:block focus:p-4"
        >
          Skip to content
        </a>

        <header className="border-b border-slate-700 bg-surface">
          <nav
            aria-label="Main navigation"
            className="page-container flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <Link href="/" className="text-xl font-bold text-accent">
              Reel Good
            </Link>
            <Link href="/movies" className="hover:underline">
              Movies
            </Link>
            <Link href="/favorites" className="hover:underline">
              Favorites
            </Link>
            <Link href="/account" className="hover:underline">
              Account / Sign in
            </Link>
          </nav>
        </header>

        <main id="main-content" tabIndex={-1} className="page-container">
          {children}
        </main>

        <footer className="page-container text-sm text-muted">
          <Link href="/health" className="hover:underline">
            Service health
          </Link>
        </footer>
      </body>
    </html>
  );
}
