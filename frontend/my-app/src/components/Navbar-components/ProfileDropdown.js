// frontend/my-app/src/components/Navbar-components/ProfileDropdown.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faPencil } from '@fortawesome/free-solid-svg-icons';
import { djangoAxios } from '../../axios';
import { defaultAvatar } from '../../constants/avatarImages';
import useProfiles from '../../hooks/useProfiles';

export default function ProfileDropdown() {
    const { profiles, isLoading, refreshProfiles } = useProfiles();
    const [currentProfile, setCurrentProfile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isPreloading, setIsPreloading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (profiles.length > 0) {
            const savedProfileId = localStorage.getItem('currentProfileId');
            const currentProfile = profiles.find(p => p.id === parseInt(savedProfileId)) 
                               || profiles[0];
            setCurrentProfile(currentProfile);
        }
    }, [profiles]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('currentProfileId');
        navigate('/login');
    };

    const handleProfileSwitch = (profile) => {
        setCurrentProfile(profile);
        localStorage.setItem('currentProfileId', profile.id);
        setIsOpen(false);
        setIsPreloading(true);
        window.location.reload(); // Refresh to update content for new profile
    };
// Add the loading animation to the JSX return
return (
    <>
        {/* <AnimatePresence>
            {isPreloading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-50 flex items-center justify-center"
                >
                    
                </motion.div>
            )}
        </AnimatePresence> */}
        {/* Rest of your existing JSX */}
        <div className="relative" ref={dropdownRef}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer flex items-center space-x-2"
            >
                <img
                    src={currentProfile?.avatar || defaultAvatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-md object-cover"
                />
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-700 rounded-md shadow-lg"
                    >
                        <div className="py-2">
                            {profiles.map(profile => (
                                <motion.div
                                    key={profile.id}
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    className="px-4 py-2 cursor-pointer flex items-center space-x-2"
                                    onClick={() => handleProfileSwitch(profile)}
                                >
                                    <img
                                        src={profile.avatar || defaultAvatar}
                                        alt={profile.name}
                                        className="w-7 h-7 rounded-md"
                                    />
                                    <span className="text-white">{profile.name}</span>
                                </motion.div>
                            ))}

                            <div className="border-t border-gray-700 mt-2 pt-2">
                                <Link
                                    to="/manage-profiles"
                                    className="px-4 py-2 text-gray-300 hover:text-white flex items-center space-x-2"
                                >
                                    <FontAwesomeIcon icon={faPencil} />
                                    <span>Manage Profiles</span>
                                </Link>
                                <motion.div
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    className="px-4 py-2 text-gray-300 hover:text-white cursor-pointer flex items-center space-x-2"
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon icon={faSignOut} />
                                    <span>Sign out</span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </>
);
}
