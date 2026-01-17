'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isValidEmail, validatePasswordStrength, isRequired } from 'cs-tools-kit';

export const useRegister = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!isRequired(email)) return setError('L\'email est requis.');
        if (!isRequired(username)) return setError('Le nom d\'utilisateur est requis.');
        if (!isRequired(password)) return setError('Le mot de passe est requis.');
        if (!isValidEmail(email)) return setError('Format d\'email invalide.');

        const pwValidation = validatePasswordStrength(password);
        if (!pwValidation.isStrong) return setError('Mot de passe trop faible : ' + pwValidation.feedback.join(', '));
        if (password !== confirmPassword) return setError('Les mots de passe ne correspondent pas.');

        setLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Échec de l\'inscription.');
            } else {
                setSuccess('Inscription réussie ! Redirection vers la page de connexion...');
                setError(null);
                
                /* Rediriger vers login après 2 secondes */
                setTimeout(() => {
                    router.push('/login?registered=true');
                }, 2000);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Une erreur inattendue est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        loading,
        handleSubmit,
    };
}