import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Portfolio Auto-entreprise",
  description: 'Portfolio pour mon auto-entreprise, permet de présenter mes projets et compétences. Contacter moi pour plus d\'informations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-gray-800 text-white p-4 text-center">NavBar</header>
          <main className="flex-1">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">Footer</footer>
      </body>
    </html>
  );
}
