'use client';

interface ReviewFormProps {
    name: string;
    setName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    company: string;
    setCompany: (value: string) => void;
    role: string;
    setRole: (value: string) => void;
    rating: number;
    setRating: (value: number) => void;
    comment: string;
    setComment: (value: string) => void;
    error: string | null;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function ReviewForm({
    name, setName,
    email, setEmail,
    company, setCompany,
    role, setRole,
    rating, setRating,
    comment, setComment,
    error, loading, onSubmit
}: ReviewFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Nom *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Entreprise</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Poste</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Ex: CEO, Directeur..."
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Note *</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-3xl focus:outline-none"
                        >
                            <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                                ⭐
                            </span>
                        </button>
                    ))}
                    <span className="ml-2 self-center text-sm text-gray-600">
                        {rating}/5
                    </span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Votre avis *</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={6}
                    placeholder="Partagez votre expérience..."
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                disabled={loading || rating === 0}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </button>
        </form>
    );
}