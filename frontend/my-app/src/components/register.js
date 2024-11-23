import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { djangoAxios } from "../axios";
import "../login.css"

export default function Register() {

    const navigate = useNavigate();
    const [formData, setFormData] = React.useState(
        {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    );
    const [error, setError] = React.useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }
        try {
            await djangoAxios.post('/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (error) {
            if (error.response?.data?.error) {
                setError(error.response.data.error)
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error('Registration Error:', error);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Create Account</h2>
                {error && <div>{error}</div>}

                <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="text"
                        name="password"
                        id="password"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="text"
                        name="confirmPassword"
                        id="confirmPassword"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
                <div className="form-footer">
                    Already have an account?
                    <span
                        onClick={() => navigate('/login')}
                        style={{ color: '#e50914', cursor: 'pointer', marginLeft: '5px' }}
                    >
                        Log In
                    </span>
                </div>
            </form>
        </div>
    )
}