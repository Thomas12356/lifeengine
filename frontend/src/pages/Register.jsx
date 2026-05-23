import { useState } from 'react';
import { RegisterForm } from '@features/auth/components/AuthForms';

export default function Register() {
    const [error, setError] = useState('');

    async function handleSubmit(data){
        console.log(data);
    }

    return (
        <RegisterForm onSubmit={handleSubmit} error={error} />
    )
}