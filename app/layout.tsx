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
    "Describe what you need in plain English. An agent is forged on the spot.",
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
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight font-[family-name:var(--font-geist-mono)] text-[#f97316]"
          >
            FORGE
          </Link>
          <Link
            href="/registry"
            className="text-sm text-[#737373] hover:text-[#a3a3a3] transition-colors"
          >
            Registry
          </Link>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
