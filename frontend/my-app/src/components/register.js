import React from "react";
import { useNavigate } from "react-router-dom";
import { djangoAxios } from "../axios";
import "../login.css"
import { motion, AnimatePresence, animate } from "framer-motion";

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
    const [registrationState, setRegistrationState] = React.useState({
        loading: false,
        success: false,
        error: null
    })
    const [msg, setMsg] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setRegistrationState({
            loading: true,
            success: false,
            error: null
        });

        if (formData.password !== formData.confirmPassword) {
            setRegistrationState({
                loading: false,
                success: false,
                error: "passwords don't match!"
            });
            return;
        }
        try {
            const response = await djangoAxios.post('register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            setRegistrationState({
                loading: false,
                success: true,
                error: null
            })

            setTimeout(() => {
                navigate('/login');
            }, 2000)
            
        } catch (error) {
            setRegistrationState({
                loading: false,
                success: false,
                error: error.response?.data?.error || 'Registration failed. Please try again.'
            })
        }
    };

    const containerVariants = {
        initial: { opacity: 0},
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const loadingVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };


    return (
        <motion.div 
            className="min-h-screen flex items-center justify-center px-4"
            initial="initial"
            animate="animate"
            exit="exit"
            style={{backgroundImage: 'url(https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg)'}}
        >
            <div className="w-full md:w-10/12 lg:w-4/12 space-y-8 bg-black bg-opacity-80 p-8 rounded-md">
                <AnimatePresence mode="wait">
                    {registrationState.loading ? (
                        <motion.div
                            key="loading"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="text-center py-8"
                        >
                            <motion.div
                                className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                                variants={loadingVariants}
                                animate="animate"
                            />
                            <p className="text-white text-lg">Creating your account...</p>
                        </motion.div>
                    ) : registrationState.success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y:20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-between">
                                <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 1314 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-green-500 text-xl font-bold mb-2">Registration successful!!</h2>
                            <p className="text-white">Redirecting you to login...</p>
                        </motion.div>
                    ) : (
                        <motion.form 
                            onSubmit={handleSubmit} 
                            className="space-y-6 md:p-3 lg:p-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}    
                        >
                            <h2 className="text-2xl font-bold text-white text-center">Create Account</h2>
                            
                            {registrationState.error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0}}
                                    className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded"
                                >
                                    {registrationState.error}
                                </motion.div>
                            )}

                            <div className="form-group">
                                {/* <label htmlFor="username" className="">User Name</label> */}
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full bg-zinc-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                {/* <label htmlFor="email">E-mail</label> */}
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    placeholder="Email..."
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                {/* <label htmlFor="password">Password</label> */}
                                <input
                                    type="text"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                {/* <label htmlFor="confirmPassword">Confirm Password</label> */}
                                <input
                                    type="text"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    placeholder="Re-Type password"
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                            >
                                Register
                            </button>
                            <div className="form-footer">
                                Already have an account?
                                <span
                                    onClick={() => navigate('/login')}
                                    style={{ color: '#e50914', cursor: 'pointer', marginLeft: '5px' }}
                                >
                                    Log In
                                </span>
                            </div>
                        </motion.form>
                    )}  
                </AnimatePresence>
            </div> 
        </motion.div>
    );
}