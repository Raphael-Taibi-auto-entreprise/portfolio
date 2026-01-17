import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: "Développeur Full Stack | Portfolio Professionnel",
    template: "%s | Portfolio",
  },
  description: 'Développeur Full Stack spécialisé en React, Next.js et TypeScript. Création d\'applications web modernes et performantes sur mesure.',
  keywords: [
    "développeur full stack",
    "développeur web",
    "React",
    "Next.js",
    "TypeScript",
    "développement web",
    "freelance",
    "portfolio développeur",
  ],
  authors: [{ name: "Portfolio" }],
  creator: "Portfolio",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Portfolio Développeur Full Stack",
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
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-gray-800 text-white p-4 text-center">Footer</footer>
        </AuthProvider>
      </body>
    </html>
  );
}
