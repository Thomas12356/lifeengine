import { useState } from 'react';
import { Box, Button, Field, Input, Stack, Heading, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export function LoginForm({ onSubmit, error, message }) {
    const [data, setData] = useState({ email: '', password: ''});

    function handleSubmit(e){
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box bg="white" maxW="400px" mx="auto" mt="general.lgSpacing" p="general.lgSpacing" borderWidth="1px" borderRadius="xl" boxShadow="md">
                <Stack gap="5">
                    <Heading size="lg" textAlign="center" color="text.solid">Log In</Heading>
                    {error && <Text textAlign="center" textStyle="errorText">{error}</Text>}
                    {message && <Text textAlign="center" textStyle="successText">{message}</Text>}

                    <Field.Root required>
                        <Field.Label color="text.solid">Email</Field.Label>

                        <Input color="text.solid" type="email" placeholder="Enter your email" value={data.email} onChange={(e) => setData({...data, email: e.target.value })} />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label color="text.solid">Password</Field.Label>

                        <Input color="text.solid" type="password" placeholder="Enter your password" value={data.password} onChange={(e) => setData({...data, password: e.target.value })} />
                    </Field.Root>

                    <Button type="submit" bg="blueLight.500">Log In</Button>
                    <NavLink textDecoration="underline" to="/register" variant="link">
                        <Text textAlign="center" textStyle="linkText">Don't have an account? Register</Text>
                    </NavLink>
                </Stack>
            </Box>
        </form>
    )
}


export function RegisterForm({ onSubmit, error }) {
    const [data, setData] = useState({ email: '', password: '', first_name: '', last_name: ''});

    function handleSubmit(e){
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box bg="white" maxW="400px" mx="auto" mt="general.lgSpacing" p="general.lgSpacing" borderWidth="1px" borderRadius="xl" boxShadow="md">
                <Stack gap="5">
                    <Heading size="lg" textAlign="center" color="text.solid">Register</Heading>
                    {error && <Text textAlign="center" textStyle="errorText">{error}</Text>}
                    <Field.Root required>
                        <Field.Label color="text.solid">First Name</Field.Label>

                        <Input color="text.solid" type="text" placeholder="Enter your first name" value={data.first_name} onChange={(e) => setData({...data, first_name: e.target.value })} />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label color="text.solid">Last Name</Field.Label>

                        <Input color="text.solid" type="text" placeholder="Enter your last name" value={data.last_name} onChange={(e) => setData({...data, last_name: e.target.value })} />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label color="text.solid">Email</Field.Label>

                        <Input color="text.solid" type="email" placeholder="Enter your email" value={data.email} onChange={(e) => setData({...data, email: e.target.value })} />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label color="text.solid">Password</Field.Label>

                        <Input color="text.solid" type="password" placeholder="Enter your password" value={data.password} onChange={(e) => setData({...data, password: e.target.value })} />
                    </Field.Root>

                    <Button type="submit" bg="blueLight.500">Create Account</Button>
                    <NavLink textDecoration="underline" to="/login" variant="link">
                        <Text textAlign="center" textStyle="linkText">Already have an account? Log In</Text>
                    </NavLink>
                </Stack>
            </Box>
        </form>
    )
}