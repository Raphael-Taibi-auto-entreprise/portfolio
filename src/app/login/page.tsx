'use client';
import { LoginForm } from "@/components/forms/LoginForm";
import { useLogin } from "@/hooks/auth/useLogin";


export default function LoginPage() {
   const login = useLogin();
   
   return (
        <LoginForm
            email={login.email}
            setEmail={login.setEmail}
            password={login.password}
            setPassword={login.setPassword}
            error={login.error}
            loading={login.loading}
            onSubmit={login.handleSubmit}
        />
   );   
}