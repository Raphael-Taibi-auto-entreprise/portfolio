'use client';
import { useRegister } from "@/hooks/auth/useRegister";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const register = useRegister();

    const handleSubmit = async () => {
        const success = await register.handleSubmit();
        if (success) router.push('/login');
    };

    return (
        <RegisterForm
            username={register.username}
            setUsername={register.setUsername}
            email={register.email}
            setEmail={register.setEmail}
            password={register.password}
            setPassword={register.setPassword}
            confirmPassword={register.confirmPassword}
            setConfirmPassword={register.setConfirmPassword}
            error={register.error}
            loading={register.loading}
            onSubmit={handleSubmit}
        />
    );
}
        
