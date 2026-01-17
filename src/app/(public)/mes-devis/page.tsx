import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileText, Clock, CheckCircle, XCircle, Calendar, Building, Phone } from "lucide-react";

export default async function MesDevisPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const quotes = await prisma.quote.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /**
   * Retourne le badge de statut avec les bonnes couleurs
   */
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "En attente",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      accepted: {
        label: "Accepté",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        label: "Refusé",
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
        <Icon size={16} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes devis</h1>
          <p className="text-gray-600">Suivez l'état de vos demandes de devis</p>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun devis</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore fait de demande de devis</p>
            <a
              href="/devis"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Demander un devis
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote: typeof quotes[number]) => (
              <article
                key={quote.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">{quote.projectType}</h2>
                      {getStatusBadge(quote.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <time dateTime={quote.createdAt.toISOString()}>
                        Demandé le {new Date(quote.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {quote.company && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Building size={18} className="text-gray-400" />
                      <span>{quote.company}</span>
                    </div>
                  )}
                  {quote.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={18} className="text-gray-400" />
                      <span>{quote.phone}</span>
                    </div>
                  )}
                  {quote.budget && (
                    <div className="text-gray-700">
                      <span className="font-medium">Budget:</span> {quote.budget}
                    </div>
                  )}
                  {quote.deadline && (
                    <div className="text-gray-700">
                      <span className="font-medium">Délai souhaité:</span> {quote.deadline}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Description du projet</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{quote.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
