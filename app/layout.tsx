import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forge — Synthesize Agents on Demand",
  description:
    "Describe what you need in plain English. An agent is forged on the spot — with cost estimates, integrations, and full specs.",
  openGraph: {
    title: "Forge — Synthesize Agents on Demand",
    description:
      "Describe what you need in plain English. An agent is forged on the spot.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f5f0]">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-[#1a1a1a]">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#f97316] flex items-center justify-center group-hover:shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-shadow duration-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight font-[family-name:var(--font-geist-mono)] text-[#f5f5f0]">
                FORGE
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/registry"
                className="text-sm text-[#737373] hover:text-[#f5f5f0] transition-colors duration-200"
              >
                Registry
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#1a1a1a] py-6 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-[#525252] text-xs">
              Forge — agent synthesis platform
            </p>
            <p className="text-[#525252] text-xs">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
