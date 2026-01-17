import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Mail, FileText, Star, CheckCircle, XCircle, Clock, User, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default async function MonComptePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const userEmail = session.user.email;

  /* Récupérer les informations complètes de l'utilisateur */
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  /* Récupérer les statistiques des devis */
  const [totalQuotes, approvedQuotes, rejectedQuotes, negotiatingQuotes] = await Promise.all([
    prisma.quote.count({
      where: { email: userEmail },
    }),
    prisma.quote.count({
      where: { email: userEmail, status: "approved" },
    }),
    prisma.quote.count({
      where: { email: userEmail, status: "rejected" },
    }),
    prisma.quote.count({
      where: { email: userEmail, status: "negotiating" },
    }),
  ]);

  /* Récupérer le nombre d'avis validés */
  const approvedReviews = await prisma.review.count({
    where: {
      email: userEmail,
      status: "approved",
      isPublic: true,
    },
  });

  const hasCompleteProfile = user?.firstName && user?.lastName && user?.phone && user?.address && user?.postalCode && user?.city;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Mon compte</h1>
            <Link
              href="/mon-compte/modifier"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Modifier mes informations
            </Link>
          </div>

          {!hasCompleteProfile && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 text-sm">
                ⚠️ Complétez vos informations personnelles pour faciliter la gestion de vos devis et futures facturations.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de contact */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Mail size={16} />
                CONTACT
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="text-gray-900">{user?.email || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Téléphone</span>
                  <p className="text-gray-900 flex items-center gap-2">
                    {user?.phone ? (
                      <>
                        <Phone size={16} className="text-gray-400" />
                        {user.phone}
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Non renseigné</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <User size={16} />
                IDENTITÉ
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Prénom</span>
                  <p className="text-gray-900">{user?.firstName || <span className="text-gray-400 italic">Non renseigné</span>}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Nom</span>
                  <p className="text-gray-900">{user?.lastName || <span className="text-gray-400 italic">Non renseigné</span>}</p>
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <MapPin size={16} />
                ADRESSE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <span className="text-sm text-gray-500">Rue</span>
                  <p className="text-gray-900">{user?.address || <span className="text-gray-400 italic">Non renseigné</span>}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Code postal</span>
                  <p className="text-gray-900">{user?.postalCode || <span className="text-gray-400 italic">Non renseigné</span>}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Ville</span>
                  <p className="text-gray-900">{user?.city || <span className="text-gray-400 italic">Non renseigné</span>}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Pays</span>
                  <p className="text-gray-900">{user?.country || "France"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques des devis */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Mes devis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Total</span>
                <FileText className="text-blue-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-blue-900">{totalQuotes}</p>
              <p className="text-xs text-blue-600 mt-1">Devis envoyés</p>
            </div>

            {/* Approuvés */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Acceptés</span>
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-green-900">{approvedQuotes}</p>
              <p className="text-xs text-green-600 mt-1">
                {totalQuotes > 0 ? `${Math.round((approvedQuotes / totalQuotes) * 100)}%` : "0%"}
              </p>
            </div>

            {/* En négociation */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">Négociés</span>
                <Clock className="text-orange-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-orange-900">{negotiatingQuotes}</p>
              <p className="text-xs text-orange-600 mt-1">
                {totalQuotes > 0 ? `${Math.round((negotiatingQuotes / totalQuotes) * 100)}%` : "0%"}
              </p>
            </div>

            {/* Refusés */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-700">Refusés</span>
                <XCircle className="text-red-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-red-900">{rejectedQuotes}</p>
              <p className="text-xs text-red-600 mt-1">
                {totalQuotes > 0 ? `${Math.round((rejectedQuotes / totalQuotes) * 100)}%` : "0%"}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques des avis */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-yellow-500 fill-yellow-500" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Mes avis</h2>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-700">Avis publiés</span>
              <Star className="text-yellow-600 fill-yellow-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-yellow-900">{approvedReviews}</p>
            <p className="text-xs text-yellow-600 mt-1">Avis validés et visibles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
