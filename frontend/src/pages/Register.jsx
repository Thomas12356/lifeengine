import { useState } from 'react';
import { RegisterForm } from '@features/auth/components/AuthForms';

export default function Register() {
    const [error, setError] = useState('');

    async function handleRegister(data){
        cosnole.log(data);
    }

    return (
        <RegisterForm onSubmit={handleRegister} error={error} />
    )
}