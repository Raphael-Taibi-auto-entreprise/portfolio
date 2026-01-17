import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ReviewsSection from "@/components/sections/ReviewsSection";

export const metadata: Metadata = {
  title: "Développeur Full Stack | Création de Solutions Web Modernes",
  description: "Développeur Full Stack passionné spécialisé dans React, Next.js et TypeScript. Je crée des applications web performantes et sur mesure pour transformer vos idées en réalité digitale.",
  keywords: [
    "développeur full stack",
    "développeur web",
    "React",
    "Next.js",
    "TypeScript",
    "développement web",
    "application web",
    "site web sur mesure",
    "freelance développeur",
  ],
  authors: [{ name: "Portfolio" }],
  openGraph: {
    title: "Développeur Full Stack | Solutions Web Modernes",
    description: "Transformez vos idées en solutions digitales performantes avec un développeur passionné.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Développeur Full Stack | Solutions Web Modernes",
    description: "Création d'applications web modernes avec React, Next.js et TypeScript",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootPage() {
  return (
    <div>
      <Hero />
      <ReviewsSection />
    </div>
  );
}
