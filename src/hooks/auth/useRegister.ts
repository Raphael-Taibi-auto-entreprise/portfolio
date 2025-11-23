'use client';

import React, { useState } from 'react';
import { isValidEmail, validatePasswordStrength, isRequired } from 'cs-tools-kit';

export const useRegister = () => {
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () =>{
        setError(null);

        if (!isRequired(email)) return setError('Email is required.');
        if (!isRequired(username)) return setError('Username is required.');
        if (!isRequired(password)) return setError('Password is required.');
        if (!isValidEmail(email)) return setError('Invalid email format.');

        const pwValidation = validatePasswordStrength(password);
        if (!pwValidation.isStrong) return setError(pwValidation.feedback.join(', ') );
        if (password !== confirmPassword) return setError('Passwords do not match.');

        setLoading(true);
        try {
            //call api temp
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Registration failed.');
            } else {
                setError(null);
                return true;
            }
        } catch (err) {
            console.error('Registration error:', err); //apparait bien en cosole log si erreur 
            setError('An unexpected error occurred. Please try again later.'); // Bien visible sur le Front si erreur
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
        loading,
        handleSubmit,
    };
}