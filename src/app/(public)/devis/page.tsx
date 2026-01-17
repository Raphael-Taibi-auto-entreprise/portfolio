'use client';

import { QuoteForm } from "@/components/forms/QuoteForm";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function DevisPage() {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [projectType, setProjectType] = useState('');
    const [budget, setBudget] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, email, phone, company, 
                    projectType, budget, deadline, description,
                    userId: session?.user?.id || null,
                }),
            });

            if (!response.ok) throw new Error('Erreur lors de l\'envoi');

            setSuccess(true);
            setName('');
            setEmail('');
            setPhone('');
            setCompany('');
            setProjectType('');
            setBudget('');
            setDeadline('');
            setDescription('');
        } catch (err) {
            setError('Erreur lors de l\'envoi de la demande');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Demander un devis</h1>
            <p className="text-gray-600 mb-8">
                Remplissez ce formulaire pour recevoir un devis personnalisé pour votre projet.
            </p>
            
            {success && (
                <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
                    Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.
                </div>
            )}

            <QuoteForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                company={company}
                setCompany={setCompany}
                projectType={projectType}
                setProjectType={setProjectType}
                budget={budget}
                setBudget={setBudget}
                deadline={deadline}
                setDeadline={setDeadline}
                description={description}
                setDescription={setDescription}
                error={error}
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
}