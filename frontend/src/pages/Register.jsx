import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Components
import { RegisterForm } from '@features/auth/components/AuthForms';
// Services
import { registerUser } from '@features/auth/utils/authService';
import { Box } from "@chakra-ui/react"

export default function Register() {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(data){
        try {
            const result = await registerUser(data);
            navigate('/login', { replace: true, state: { message: result.message } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed!');
        }
    }

    return (
        <Box
            w="100%"
            alignItems="center"
            justifyContent="center"
            mt="2"
        >
            <RegisterForm onSubmit={handleSubmit} error={error}/>
        </Box>
    )
}