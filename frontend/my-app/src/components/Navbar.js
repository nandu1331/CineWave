import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { djangoAxios } from "../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

import NavLinks from "./Navbar-components/NavLinks";
import SearchBar from "./Navbar-components/SearchBar";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);

    const navigate = useNavigate();

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 150);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // User info fetch
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setIsLoaded(true);
                setError(null);
                const response = await djangoAxios.get('user/info/');
                setUsername(response.data.username);
            } catch (error) {
                if (error.response?.status === 401) {
                    handleLogout();
                } else {
                    setError('Failed to fetch user Info');
                }
            } finally {
                setIsLoaded(false);
            }
        };

        if (localStorage.getItem('access_token')) {
            fetchUserInfo();
        } else {
            setIsLoaded(false);
        }
    }, []);

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUsername('');
        navigate('/login');
    };

    // Mobile menu toggle
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Animation variants
    const navVariants = {
        initial: { opacity: 0, y: -50 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const mobileMenuVariants = {
        initial: { 
            opacity: 0, 
            height: 0
        },
        animate: { 
            opacity: 1, 
            height: 'auto',
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        exit: { 
            opacity: 0, 
            height: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.nav
            initial="initial"
            animate="animate"
            variants={navVariants}
            className={`
                fixed top-0 left-0 w-full z-50 
                transition-all duration-500 ease-in-out
                ${isScrolled ? 'bg-black/90 shadow-lg' : 'bg-transparent'}
            `}
        >
            <div className="container p-8 flex gap-5 justify-between items-center py-3 md:py-5">
                {/* Mobile Menu Toggle */}
                <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className="lg:hidden text-white ml-0"
                    onClick={toggleMobileMenu}
                >
                    <FontAwesomeIcon 
                        icon={isMobileMenuOpen ? faTimes : faBars} 
                        className="w-6 h-6" 
                    />
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center">
                    <NavLinks />
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center pr-5 md:pr-10 lg:pr-16">
                    <SearchBar isMobile={isMobileMenuOpen} />
                    {username ? (
                        <div className="flex items-center space-x-4">
                            <motion.span 
                                className="text-white text-lg font-medium capitalize"
                                whileHover={{ scale: 1.05 }}
                            >
                                {username}
                            </motion.span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.1 }}
                                onClick={handleLogout}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <FontAwesomeIcon icon={faSignOut} className="text-2xl" />
                            </motion.button>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        variants={mobileMenuVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="lg:hidden absolute top-full left-0 w-full bg-black/90"
                    >
                        <div className="container mx-auto px-4 py-4">
                            <NavLinks isMobile />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}