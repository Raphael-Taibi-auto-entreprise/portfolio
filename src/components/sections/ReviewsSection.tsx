import { prisma } from "@/lib/prisma";
import { Star, Quote } from "lucide-react";

export default async function ReviewsSection() {
  const reviews = await prisma.review.findMany({
    where: {
      status: "approved",
      isPublic: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section 
      className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="reviews-heading" className="text-4xl font-bold text-gray-800 mb-4">
            Ce que disent mes clients
          </h2>
          <p className="text-gray-600 text-lg">
            Découvrez les retours d'expérience de ceux qui m'ont fait confiance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review: typeof reviews[number]) => (
            <article
              key={review.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <meta itemProp="ratingValue" content={review.rating.toString()} />
                  <meta itemProp="bestRating" content="5" />
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <Quote className="text-gray-300" size={24} aria-hidden="true" />
              </div>

              <p className="text-gray-700 mb-4 line-clamp-4 italic" itemProp="reviewBody">
                "{review.comment}"
              </p>

              <div className="border-t pt-4" itemProp="author" itemScope itemType="https://schema.org/Person">
                <p className="font-semibold text-gray-800" itemProp="name">{review.name}</p>
                {review.role && review.company && (
                  <p className="text-sm text-gray-500">
                    {review.role} chez {review.company}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
