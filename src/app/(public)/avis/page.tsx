'use client';

import { ReviewForm } from "@/components/forms/ReviewForm";
import { useState } from "react";

export default function AvisPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (rating === 0) {
            setError('Veuillez sélectionner une note');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email: email || null, 
                    company: company || null, 
                    role: role || null, 
                    rating, 
                    comment 
                }),
            });

            if (!response.ok) throw new Error('Erreur lors de l\'envoi');

            setSuccess(true);
            setName('');
            setEmail('');
            setCompany('');
            setRole('');
            setRating(0);
            setComment('');
        } catch (err) {
            setError('Erreur lors de l\'envoi de votre avis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Laisser un avis</h1>
            <p className="text-gray-600 mb-8">
                Votre avis sera vérifié avant publication. Merci de votre retour !
            </p>
            
            {success && (
                <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
                    Merci pour votre avis ! Il sera publié après validation.
                </div>
            )}

            <ReviewForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                company={company}
                setCompany={setCompany}
                role={role}
                setRole={setRole}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                error={error}
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
}