import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokeTeamAI",
  description: "Generate competitive Pokemon teams instantly with AI. No signup required. Get Pokemon Showdown format teams with expert strategy guides for any battle format.",
  keywords: "pokemon, team builder, competitive, AI, showdown, strategy, VGC, OU, doubles, singles",
  authors: [{ name: "Pokemon Team Builder" }],
  creator: "Pokemon Team Builder",
  publisher: "Pokemon Team Builder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PokeTeamAI",
    description: "Generate competitive Pokemon teams instantly with AI. No signup required.",
    type: "website",
    locale: "en_US",
    siteName: "Pokemon Team Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokeTeamAI",
    description: "Generate competitive Pokemon teams instantly with AI. No signup required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
