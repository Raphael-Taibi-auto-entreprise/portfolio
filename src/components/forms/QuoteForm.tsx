'use client';

interface QuoteFormProps {
    name: string;
    setName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    company: string;
    setCompany: (value: string) => void;
    projectType: string;
    setProjectType: (value: string) => void;
    budget: string;
    setBudget: (value: string) => void;
    deadline: string;
    setDeadline: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    error: string | null;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function QuoteForm({
    name, setName,
    email, setEmail,
    phone, setPhone,
    company, setCompany,
    projectType, setProjectType,
    budget, setBudget,
    deadline, setDeadline,
    description, setDescription,
    error, loading, onSubmit
}: QuoteFormProps) {
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
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                    <label className="block text-sm font-medium mb-2">Type de projet *</label>
                    <input
                        type="text"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        required
                        placeholder="Ex: Site vitrine, E-commerce..."
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Budget estimé</label>
                    <input
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Ex: 5000-10000€"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Deadline souhaitée</label>
                    <input
                        type="text"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        placeholder="Ex: Dans 2 mois"
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description du projet *</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    placeholder="Décrivez votre projet en détail..."
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Envoi en cours...' : 'Demander un devis'}
            </button>
        </form>
    );
}