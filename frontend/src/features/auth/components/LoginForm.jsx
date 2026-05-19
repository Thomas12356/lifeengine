import { useState } from 'react';
import { Box, Button, Field, Input, Stack, Heading } from "@chakra-ui/react";

export default function LoginForm({ onSubmit, error }) {
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

                    <Field.Root required>
                        <Field.Label color="text.solid">Email</Field.Label>

                        <Input color="text.solid" type="email" placeholder="Enter your email" value={data.email} onChange={(e) => setData({...data, email: e.target.value })} />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label color="text.solid">Password</Field.Label>

                        <Input color="text.solid" type="password" placeholder="Enter your password" value={data.password} onChange={(e) => setData({...data, password: e.target.value })} />
                    </Field.Root>

                    <Button type="submit" bg="blueLight.500">Log In</Button>
                </Stack>
            </Box>
        </form>
    )
}
