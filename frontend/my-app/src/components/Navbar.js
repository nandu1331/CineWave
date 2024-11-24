import React, { useState, useEffect } from "react";
import NavLinks from "./Navbar-components/NavLinks";
import SearchBar from "./Navbar-components/SearchBar";
import { useNavigate } from "react-router-dom";
import { djangoAxios } from "../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faSignOut } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        // Fetch user info when component mounts
        const fetchUserInfo = async () => {
            try {
                setIsLoaded(true);
                setError(null);
                const response = await djangoAxios.get('user/info/');
                setUsername(response.data.username)
            } catch (error) {
                if (error.response?.status === 401) {
                    handleLogout();
                } else {
                    setError('Failed to fetch user Info')
                }
            } finally {
                setIsLoaded(false);
            }
        };

        if (localStorage.getItem('access_token')) {
            fetchUserInfo();
        }
        else {
            setIsLoaded(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUsername('');
        navigate('/login');
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full flex flex-row justify-between items-center px-6 z-50 transition-colors duration-500 ease-in-out ${
                isScrolled ? "bg-black bg-opacity-90" : "bg-transparent"
            }`}
        >
            {/* Mobile Hamburger Icon */}
            <div className="block lg:hidden" onClick={toggleMobileMenu}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex flex-row items-center gap-5 justify-between">
                <NavLinks />
            </div>

            {/* Search Bar */}
            <div className="flex flex-row gap-10 items-center align-middle">
            <SearchBar isMobile={isMobileMenuOpen} /> 
            <div className="flex flex-row gap-7 items-center align-middle mr-12">
                {username && (
                    <>
                        <span className="text-white capitalize text-xl hover:text-gray-300 transition-colors duration-200">
                            {username}
                        </span>
                        <FontAwesomeIcon 
                            icon={faSignOut}
                            className="text-white text-4xl hover:text-red-600 hover:scale-125 transition-all duration-200 cursor-pointer"
                        />
                    </>
                )}
            </div>

            </div>

            {/* Mobile Menu (Hidden by default on large screens, shown when isMobileMenuOpen is true) */}
            <div
                className={`lg:hidden absolute top-16 p-3 left-0 w-full bg-black bg-opacity-90 flex flex-col justify-center ${
                    isMobileMenuOpen ? "block" : "hidden"
                }`}
            >
                <NavLinks isMobile={isMobileMenuOpen} />
            </div>
        </nav>
    );
}
