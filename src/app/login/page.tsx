'use client';
import { LoginForm } from "@/components/forms/LoginForm";
import { useLogin } from "@/hooks/auth/useLogin";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
   const login = useLogin();
   const searchParams = useSearchParams();
   const registered = searchParams.get('registered');
   
   const successMessage = registered === 'true' 
      ? 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
      : null;
   
   return (
        <LoginForm
            email={login.email}
            setEmail={login.setEmail}
            password={login.password}
            setPassword={login.setPassword}
            error={login.error}
            loading={login.loading}
            onSubmit={login.handleSubmit}
            successMessage={successMessage}
        />
   );   
}

export default function LoginPage() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
         <LoginContent />
      </Suspense>
   );
}