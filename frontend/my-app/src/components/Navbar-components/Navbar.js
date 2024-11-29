// src/components/Navbar-components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useViewportScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { djangoAxios } from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { scrollYProgress } = useViewportScroll();

    // Scroll-based animations
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

    const menuVariants = {
        closed: {
            opacity: 0,
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.1
            }
        }
    };

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 150);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // User info fetch
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setIsLoading(true);
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
                setIsLoading(false);
            }
        };

        if (localStorage.getItem('access_token')) {
            fetchUserInfo();
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUsername('');
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <motion.nav
            initial="initial"
            animate="animate"
            variants={navVariants}
            style={{ 
                backgroundColor,
                height: navHeight
            }}
            className="fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out"
        >
            <div className="container mx-auto px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMobileMenu}
                            className="text-white p-2"
                        >
                            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
                        </motion.div>
                    </div>

                    {/* Search and User Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden lg:block">
                             <SearchBar isMobile={false} />
                        </div>
                        
                        {!isLoading && (
                            <div className="flex items-center space-x-4">
                                <span className="text-white">{username}</span>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="text-white text-4xl hover:text-red-500 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faSignOut} />
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            className="lg:hidden fixed inset-0 top-[65px] bg-black/95 backdrop-blur-sm"
                        >
                            <div className="p-4 flex flex-col space-y-4 items-center justify-center">           
                                <SearchBar isMobile={true} />
                                <NavLinks 
                                    isMobile={true} 
                                    onLinkClick={() => setIsMobileMenuOpen(false)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
