import React, { useState } from 'react';

export default function LoginForm({ onSubmit, error }) {
    const [data, setData] = useState({ email: '', password: ''});

    function handleSubmit(e){
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type='email' placeholder='Email' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value})} required />
            <input type='password' placeholder='Password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value})} required />
            <button type='submit'>Log In</button>
        </form>
    )
}
