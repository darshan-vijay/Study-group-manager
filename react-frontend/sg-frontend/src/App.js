import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <Container className="p-5 text-center">
                <Routes>
                    <Route path="/" element={<WelcomeScreen />} />
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate replace to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />
                    } />
                    <Route path="/signup" element={
                        isAuthenticated ? <Navigate replace to="/dashboard" /> : <Signup onSignupSuccess={handleLoginSuccess} />
                    } />
                    <Route path="/dashboard" element={
                        isAuthenticated ? <Dashboard /> : <Navigate replace to="/login" />
                    } />
                </Routes>
            </Container>
        </Router>
    );
}

function WelcomeScreen() {
    return (
        <>
            <h1>Welcome to Study Group Manager</h1>
            <Link to="/login" className="btn btn-primary m-2">Login</Link>
            <Link to="/signup" className="btn btn-secondary m-2">Sign Up</Link>
        </>
    );
}

export default App;
