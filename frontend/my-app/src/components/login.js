// src/components/login.js
import React, { useState } from 'react';
import { djangoAxios } from '../axios';
import { useNavigate } from 'react-router-dom';
import '../login.css';

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        try {
            console.log('Attempting login...'); // Debug log
            const response = await djangoAxios.post('token/', credentials);
            console.log('Login response:', response); // Debug log
            
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            navigate('/');
        } catch (error) {
            console.error('Login error:', error.response || error); // Debug log
            setError(
                error.response?.data?.detail || 
                'Login failed. Please check your credentials.'
            );
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <div className='form-footer'>
                    Don't have an account?
                    <span 
                        style={{ color: '#e50914', cursor: 'pointer', marginLeft: '5px'}}
                        onClick={() => navigate('/register')}
                    >
                        Sign Up
                    </span>
                </div>
            </form>
        </div>
    );
}

export default Login;
