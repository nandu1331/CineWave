import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { djangoAxios } from '../axios';
import '../login.css'

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    
    const [loginState, setLoginState] = useState({
        loading: false,
        success: false,
        error: null
    });
    
    // For background preloading
    const [isPreloading, setIsPreloading] = useState(false);

    // Preload essential components
    const preloadHomeComponents = async () => {
        try {
            // Preload API calls for initial route
            const endpoints = [
                djangoAxios.get('movie/popular'),
                djangoAxios.get('movie/now_playing'),
                // Add other essential API calls
            ];
            await Promise.all(endpoints);
        } catch (error) {
            console.error('Preloading error:', error);
            // Continue anyway as this is just optimization
        }
    };

    const handleChange = (e) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginState({ loading: true, success: false, error: null });

        try {
            const response = await djangoAxios.post('token/', credentials);
            
            // If login successful
            // setLoginState({ loading: false, success: true, error: null });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            navigate('/select-profile');
            // Start preloading home components
            // setIsPreloading(true);
            // await preloadHomeComponents();

            // // Navigate to home after a brief delay
            // setTimeout(() => {
            //     
            // }, 4000);

        } catch (error) {
            setLoginState({
                loading: false,
                success: false,
                error: error.response?.data?.detail || 'Login failed. Please check your credentials.'
            });
        }
    };

    return (
        <AnimatePresence mode='wait'>
            {loginState.success ? (
                <motion.div
                    key="success-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black flex items-center justify-center z-50"
                >
                    <div className="text-center space-y-8">
                        {/* Success Animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring",
                                duration: 0.8 
                            }}
                            className="success-check-wrapper"
                        >
                            <svg 
                                className="success-check-icon" 
                                viewBox="0 0 24 24"
                            >
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5 }}
                                    d="M3,12 L9,18 L21,6"
                                    stroke="#E50914"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>
                        </motion.div>

                        {/* Success Text */}
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-3xl font-bold text-white"
                        >
                            Login Successful!
                        </motion.h2>

                        {/* Loading Animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-4"
                        >
                            <p className="text-xl text-gray-300">
                                Curating spicy movies for you...
                            </p>
                            <div className="loading-animation">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 360]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="loader"
                                />
                            </div>
                        </motion.div>
                     </div>
                </motion.div>
            ) : (
                <motion.div 
                    className="min-h-screen bg-black bg-opacity-75 flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        backgroundImage: 'url(https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <motion.form
                        onSubmit={handleLogin}
                        className="space-y-6 bg-black bg-opacity-80 p-8 rounded-lg w-full max-w-md"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold text-white text-center mb-8">Sign In</h2>
                
                        {/* Username Input */}
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-white/50 py-4"
                                placeholder="Username"
                                required
                            />
                        </div>
                
                        {/* Password Input */}
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-white/50 px-3 py-4"
                                placeholder="Password"
                                required
                            />
                        </div>
                
                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {loginState.error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-500 text-sm text-center"
                                >
                                    {loginState.error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loginState.loading || loginState.success}
                            className={`w-full py-3 rounded font-semibold transition-all duration-300
                                ${loginState.loading || loginState.success 
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700'} text-white`}
                        >
                            {loginState.loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : loginState.success ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l5 5L20 7"></path>
                                    </svg>
                                    <span>Success!</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                        
                        {/* Success Message and Loading Indicator */}
                        <AnimatePresence>
                            {loginState.success && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <p className="text-green-500">Login successful!</p>
                                    {isPreloading && (
                                        <p className="text-gray-400 text-sm">
                                            Curating spicy movies for you...
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Sign Up Link */}
                        <div className="form-footer">
                            Don't have an account?
                            <span
                                onClick={() => navigate('/register')}
                                style={{ color: '#e50914', cursor: 'pointer', marginLeft: '5px' }}
                            >
                                Sign Up
                            </span>
                        </div>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
