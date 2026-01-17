import { ArrowRight, Code2, Rocket, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-20"
      aria-label="Section d'introduction"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles size={16} aria-hidden="true" />
            <span>Développeur Full Stack disponible</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Transformez vos idées en
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}solutions digitales
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Développeur passionné spécialisé dans la création d'applications web modernes, 
            performantes et sur mesure. Je transforme votre vision en réalité avec des 
            technologies de pointe.
          </p>

          {/* Services clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
            <article className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <Code2 className="text-blue-600 mb-3" size={32} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Développement Web</h3>
              <p className="text-gray-600 text-sm">
                Sites web et applications performantes avec React, Next.js et TypeScript
              </p>
            </article>

            <article className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <Rocket className="text-purple-600 mb-3" size={32} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Solutions sur mesure</h3>
              <p className="text-gray-600 text-sm">
                Architecture adaptée à vos besoins spécifiques et à votre croissance
              </p>
            </article>

            <article className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <Sparkles className="text-pink-600 mb-3" size={32} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Design Moderne</h3>
              <p className="text-gray-600 text-sm">
                Interfaces élégantes et intuitives pour une expérience utilisateur optimale
              </p>
            </article>
          </div>

          {/* CTAs */}
          <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8" aria-label="Actions principales">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
              aria-label="Demander un devis pour votre projet"
            >
              Demander un devis
              <ArrowRight size={20} aria-hidden="true" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
              aria-label="Me contacter directement"
            >
              Me contacter
            </Link>
          </nav>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-gray-200 mt-12" role="region" aria-label="Statistiques">
            <div>
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Projets réalisés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">5⭐</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
