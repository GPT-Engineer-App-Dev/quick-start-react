import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth, SupabaseAuthUI } from '../integrations/supabase/auth.jsx';
import { Box, Container, Heading } from '@chakra-ui/react';

const Login = () => {
    const { session } = useSupabaseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate('/');
        }
    }, [session, navigate]);

    return (
        <Container centerContent>
            <Box p={6} rounded="md" w="100%" maxW="md">
                <Heading as="h2" size="xl" mb={4}>Login</Heading>
                <SupabaseAuthUI />
            </Box>
        </Container>
    );
};

export default Login;