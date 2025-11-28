export default interface LoginFormProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string | null;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}
