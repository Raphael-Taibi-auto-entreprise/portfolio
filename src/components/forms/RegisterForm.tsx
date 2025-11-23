'use client';
import React from 'react';
import { Card } from 'cs-tools-kit';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import RegisterFormProps from '../../models/registerForm';


export const RegisterForm: React.FC<RegisterFormProps> = ({
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
    onSubmit,
}) => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
                <Card
                    variant='elevated'
                    padding='lg'
                    className='w-full max-w-md'
                    header={<h2 className='text-2xl font-bold text-center'>Register</h2>}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                        className='flex flex-col gap-4'
                    >
                        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {error && <p className='text-red-500 text-sm'>{error}</p>}
                        <div className='flex justify-center'>
                            <Button type="submit" size="lg" className="px-8 py-2 text-base hover:bg-stone-800 hover:text-white" disabled={loading} variant="secondary">
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}