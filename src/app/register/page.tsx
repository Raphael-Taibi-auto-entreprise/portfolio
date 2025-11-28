'use client';
import { useRegister } from "@/hooks/auth/useRegister";
import { RegisterForm } from "@/components/forms/RegisterForm";


export default function RegisterPage() {
    const register = useRegister();

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
            onSubmit={register.handleSubmit}
        />
    );
}
        
