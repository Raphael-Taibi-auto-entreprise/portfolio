'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from 'cs-tools-kit';
import { useLogin } from '@/hooks/auth/useLogin';

export function LoginForm() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleSubmit,
    } = useLogin();

    return ( 
        <div className='bg-white p-8 rounded-lg shadow-md w-full maw-w-md'>
            <Card 
                variant='elevated'
                padding='lg'
                className='w-full max-w-md'
                header={<h2 className='text-2xl font-bold text-center'>Login</h2>}
            >
                <form 
                    onSubmit= {(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                    }} 
                    className='flex flex-col gap-4'
                >
                    <Input 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <Input 
                        placeholder="Password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    <div className='flex justify-center'>
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="px-8 py-2 text-base hover:bg-stone-800 hover:text-white" 
                            disabled={loading} 
                            variant="secondary"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}