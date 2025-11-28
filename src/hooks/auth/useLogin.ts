'use client';

import React, { useState } from 'react';
import { isValidEmail, isRequired } from 'cs-tools-kit';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useLogin() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const validate = () => {
        if (!isRequired(email)) return 'Email is required.';
        if (!isValidEmail(email)) return 'Invalid email format.';
        if (!isRequired(password)) return 'Password is required.';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) return setError(validationError);

        setLoading(true);

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError('Username or password is incorrect.');
            console.debug('Login error:', res.error);
            setLoading(false);
            return;
        }

        router.push('/'); // Redirect to home page on successful login
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleSubmit,
    };
}