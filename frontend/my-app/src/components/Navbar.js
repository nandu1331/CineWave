import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useViewportScroll, useTransform } from "framer-motion";
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
    const { scrollYProgress } = useViewportScroll();

    // Advanced scroll-based animations
    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.1],
        ['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']
    );
    const navHeight = useTransform(
        scrollYProgress,
        [0, 0.1],
        ['80px', '60px']
    );

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 150);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    // Advanced animation variants
    const navVariants = {
        initial: { 
            opacity: 0, 
            y: -100 
        },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring",
                stiffness: 120,
                damping: 20,
                delay: 0.2
            }
        }
    };

    const mobileMenuVariants = {
        initial: { 
            opacity: 0, 
            x: -100,
            scale: 0.9
        },
        animate: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15,
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0, 
            x: 100,
            scale: 0.9,
            transition: {
                duration: 0.3
            }
        }
    };

    const menuItemVariants = {
        initial: { 
            opacity: 0, 
            x: -50 
        },
        animate: { 
            opacity: 1, 
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <motion.nav
            initial="initial"
            animate="animate"
            variants={navVariants}
            style={{ 
                backgroundColor: backgroundColor,
                height: navHeight
            }}
            className={`
                fixed top-0 left-0 z-50 w-full lg:pr-[60px]
                transition-all duration-500 ease-in-out
            `}
        >
            <div className="px-4 py-2 lg:py-0 flex justify-between items-center h-full">
                {/* Mobile Menu Toggle with Sophisticated Animation */}
                <motion.div 
                    whileTap={{ 
                        scale: 0.85,
                        rotate: 180
                    }}
                    whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.3 }
                    }}
                    className="lg:hidden text-white"
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

                {/* Right Side Actions with Interactive Animations */}
                <div className="flex items-center gap-5 ml-auto">
                    <SearchBar isMobile={isMobileMenuOpen} />
                    {username ? (
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            className="flex items-center gap-5"
                        >
                            <motion.span 
                                whileHover={{ 
                                    scale: 1.05,
                                    color: '#3B82F6'
                                }}
                                className="text-white text-lg font-medium capitalize"
                            >
                                {username}
                            </motion.span>
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ 
                                    scale: 1.1,
                                    rotate: 360,
                                    transition: { duration: 0.5 }
                                }}
                                onClick={handleLogout}
                                className="text-white hover:text-red-500 transition-colors"
                            >
                                <FontAwesomeIcon icon={faSignOut} className="text-4xl" />
                            </motion.div>
                        </motion.div>
                    ) : null}
                </div>
            </div>

            {/* Mobile Menu with Advanced Animations */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        variants={mobileMenuVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="lg:hidden absolute top-full left-0 w-full bg-black bg-opacity-90"
                    >
                        <div className="container mx-auto px-4 py-4">
                            <motion.div variants={menuItemVariants}>
                                <NavLinks isMobile />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}