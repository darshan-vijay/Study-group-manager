import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login with:', email, password);
        // Implement login logic here
        onLoginSuccess(); 
        navigate('/dashboard'); 
    };

    return (
        <Container>
            <h2>Login</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormGroup>
                <Button type="submit" color="primary">Login</Button>
            </Form>
        </Container>
    );
}

export default Login;
