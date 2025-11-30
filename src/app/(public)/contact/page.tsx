'use client';

import { ContactForm } from "@/components/forms/ContactForm";
import { useState } from "react";

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message }),
            });

            if (!response.ok) throw new Error('Erreur lors de l\'envoi');

            setSuccess(true);
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch (err) {
            setError('Erreur lors de l\'envoi du message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Contactez-nous</h1>
            
            {success && (
                <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
                    Message envoyé avec succès !
                </div>
            )}

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
    );
}