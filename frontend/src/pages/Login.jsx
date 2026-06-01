import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from '@features/auth/utils/authService';
import { LoginForm } from "@/features/auth/components/AuthForms";
import { useAuth } from "@context/AuthContext";
import { useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react"

export default function LoginPage(){
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, []);

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
        <Box
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt="2"
        >
                <LoginForm onSubmit={handleLoginAttempt} error={error} message={message} />
        </Box>
    )
}

