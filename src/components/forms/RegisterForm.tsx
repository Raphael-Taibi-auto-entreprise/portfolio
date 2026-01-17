'use client';
import React from 'react';
import Link from 'next/link';
import { Card } from 'cs-tools-kit';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
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
    success,
    loading,
    onSubmit,
}) => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4'>
            <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
                <div className='flex justify-center mb-6'>
                    <div className='bg-blue-100 p-4 rounded-full'>
                        <UserPlus size={32} className='text-blue-600' />
                    </div>
                </div>
                
                <Card
                    variant='elevated'
                    padding='lg'
                    className='w-full max-w-md'
                    header={
                        <div className='text-center'>
                            <h2 className='text-2xl font-bold mb-2'>Créer un compte</h2>
                            <p className='text-gray-600 text-sm'>Rejoignez-nous pour accéder à toutes les fonctionnalités</p>
                        </div>
                    }
                >
                    <form
                        onSubmit={onSubmit}
                        className='flex flex-col gap-4'
                    >
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Nom d'utilisateur</label>
                            <Input 
                                placeholder="johndoe" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                            <Input 
                                type="email"
                                placeholder="vous@exemple.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Mot de passe</label>
                            <Input 
                                placeholder="Minimum 8 caractères" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Confirmer le mot de passe</label>
                            <Input 
                                placeholder="Même mot de passe" 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        {error && (
                            <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm'>
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className='bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm'>
                                {success}
                            </div>
                        )}
                        
                        <div className='flex justify-center'>
                            <Button 
                                type="submit" 
                                size="lg" 
                                className="w-full px-8 py-2 text-base hover:bg-stone-800 hover:text-white" 
                                disabled={loading} 
                                variant="secondary"
                            >
                                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                            </Button>
                        </div>
                        
                        <div className='text-center mt-4'>
                            <p className='text-sm text-gray-600'>
                                Déjà un compte ?{' '}
                                <Link href='/login' className='text-blue-600 hover:text-blue-700 font-medium'>
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}