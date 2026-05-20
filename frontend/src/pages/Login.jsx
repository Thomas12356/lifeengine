import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from '@features/auth/utils/authService';
import LoginForm from "@/features/auth/components/LoginForm";
import { useAuth } from "@context/AuthContext";

export default function LoginPage(){
    const [error, setError] = useState('');
    const { setUser } = useAuth();
    const navigate = useNavigate();

    async function handleLoginAttempt(credentials){
        try{
            const user = await loginUser(credentials);
            localStorage.setItem('user', JSON.stringify(user)); // keep for persistence on refresh ??
            setUser(user);

            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid Credentials');
        }
    }

    return (
        <div>
            <LoginForm onSubmit={handleLoginAttempt} error={error} />
        </div>
    )
}