// frontend/my-app/src/components/ProfileManagement/ProfileSelection.js
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { djangoAxios } from '../../axios';
import { defaultAvatar } from '../../constants/avatarImages';
import SuccessScreen from './SuccessAnimation';

export default function ProfileSelection() {
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const response = await djangoAxios.get('profiles/');
            setProfiles(response.data);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };

    const handleProfileSelect = (profile) => {
        setSelectedProfile(profile);
        setShowSuccess(true);
        localStorage.setItem('currentProfileId', profile.id);
        
        setTimeout(() => {
            navigate('/');
        }, 3000);
    };

    const handleManageProfiles = () => {
        navigate('/manage-profiles');
    };

    // Container animation variants
    const containerVariants = {
        hidden: { 
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.4
            }
        }
    };

    // Profile item animation variants
    const profileVariants = {
        hidden: { 
            opacity: 0,
            y: 20,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        }
    };

    // Title animation variants
    const titleVariants = {
        hidden: { 
            opacity: 0,
            y: -20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {showSuccess ? (
                <SuccessScreen selectedProfile={selectedProfile} />
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-screen bg-black text-white flex items-center justify-center"
                >
                    <div className="max-w-full mx-auto p-8 text-center">
                        <motion.h1
                            variants={titleVariants}
                            className="text-4xl font-bold mb-8"
                        >
                            Who's watching?
                        </motion.h1>

                        <motion.div 
                            className="flex gap-2 md:gap-4 xl:gap-8 p-4 flex-wrap justify-center mb-10"
                        >
                            {profiles.map((profile, index) => (
                                <motion.div
                                    key={profile.id}
                                    variants={profileVariants}
                                    whileHover={{ 
                                        scale: 1.1,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleProfileSelect(profile)}
                                    className="cursor-pointer"
                                >
                                    <img
                                        src={profile.avatar || defaultAvatar}
                                        alt={profile.name}
                                        className="w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 rounded-lg mx-auto mb-4 object-cover"
                                    />
                                    <h3 className="text-gray-400 hover:text-white transition-colors">
                                        {profile.name}
                                    </h3>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.button
                            variants={profileVariants}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleManageProfiles}
                            className="px-8 py-2 border-2 border-gray-400 text-gray-400
                                     hover:text-white hover:border-white transition-colors"
                        >
                            Manage Profiles
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
