'use client';

import { ContactForm } from "@/components/forms/ContactForm";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/ui/useToast';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const toast = useToast();
    
    const [name, setName] = useState(session?.user?.name || '');
    const [email, setEmail] = useState(session?.user?.email || '');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    subject, 
                    message,
                    userId: session?.user?.id || null,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de l\'envoi du message');
            }

            toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            
            /* Réinitialiser le formulaire */
            setSubject('');
            setMessage('');
            if (!session) {
                setName('');
                setEmail('');
            }

            /* Rediriger vers mes-messages si connecté */
            if (session) {
                setTimeout(() => {
                    router.push('/mes-messages');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'envoi du message');
            toast.error(err.message || 'Erreur lors de l\'envoi du message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                        <Send size={16} />
                        <span>Parlons de votre projet</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Contactez-moi
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Une question ? Un projet en tête ? N'hésitez pas à me contacter, 
                        je vous répondrai dans les plus brefs délais.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulaire de contact */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-moi un message</h2>
                            <ContactForm
                                name={name}
                                setName={setName}
                                email={email}
                                setEmail={setEmail}
                                subject={subject}
                                setSubject={setSubject}
                                message={message}
                                setMessage={setMessage}
                                error={error}
                                loading={loading}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>

                    {/* Informations de contact */}
                    <div className="space-y-6">
                        {/* Carte Email */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Mail className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                    <a 
                                        href="mailto:contact@portfolio.com" 
                                        className="text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        contact@portfolio.com
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Réponse sous 24h
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Carte Téléphone */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <Phone className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                                    <a 
                                        href="tel:+33612345678" 
                                        className="text-green-600 hover:text-green-700 hover:underline"
                                    >
                                        +33 6 12 34 56 78
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Lun - Ven, 9h - 18h
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Carte Localisation */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <MapPin className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Localisation</h3>
                                    <p className="text-gray-700">Paris, France</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Disponible en remote
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info supplémentaire */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="font-semibold text-gray-900 mb-2">Vous êtes pressé ?</h3>
                            <p className="text-sm text-gray-700 mb-4">
                                Pour une réponse encore plus rapide, utilisez le formulaire de demande de devis.
                            </p>
                            <a
                                href="/devis"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Demander un devis
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}