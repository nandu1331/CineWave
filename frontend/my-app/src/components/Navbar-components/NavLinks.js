// src/components/Navbar-components/NavLinks.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NavLinks({ isMobile, onLinkClick }) {
    const links = [
        { to: "/", text: "Home", icon: "/image (2).png", isLogo: true },
        { to: "/movies", text: "Movies" },
        { to: "/tvshows", text: "TV Shows" },
        { to: "/trending", text: "Trending" },
        { to: "/mylist", text: "My List" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`
                flex 
                ${isMobile ? "flex-col items-center space-y-4" : "flex-row items-center space-x-6"}
                transition-all duration-300 ease-in-out
            `}
        >
            {links.map((link, index) => (
                <motion.div
                    key={link.to}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        to={link.to}
                        onClick={onLinkClick}
                        className={`
                            ${link.isLogo ? '' : 'text-white hover:text-gray-300 transition-colors'}
                            ${isMobile ? 'text-lg' : 'text-base'} 
                        `}
                    >
                        {link.isLogo ? (
                            <img 
                                src={link.icon} 
                                className={`h-full w-40 pr-0 ${isMobile ? 'mx-auto' : 'pr-11'}`} 
                                alt="Logo" 
                            />
                        ) : (
                            link.text
                        )}
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
