// frontend/my-app/src/components/ProfileManagement/ManageProfiles.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { djangoAxios } from '../../axios';
import { defaultAvatars, defaultAvatar } from '../../constants/avatarImages';
import EditProfileModal from './EditProfileModal';
import useProfiles from '../../hooks/useProfiles';

export default function ManageProfiles() {
    const { profiles, isLoading, refreshProfiles } = useProfiles();
    const [isEditing, setIsEditing] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const navigate = useNavigate();

    const handleEditProfile = async (profile) => {
        setEditingProfile(profile);
        setIsEditing(true);
    };

    const handleCreateProfile = () => {
        setEditingProfile({
            name: '',
            avatar: defaultAvatar,
            preferences: {}
        });
        setIsEditing(true);
    };

    const handleDeleteProfile = async (profileId) => {
        if (window.confirm('Are you sure you want to delete this profile?')) {
            try {
                await djangoAxios.delete(`profiles/${profileId}/delete/`);
                await refreshProfiles();
            } catch (error) {
                console.error('Error deleting profile:', error);
            }
        }
    };

    const handleSaveProfile = async (profileData) => {
        try {
            if (profileData.id) {
                // For existing profile
                await djangoAxios.put(`profiles/${profileData.id}/update/`, profileData);
            } else {
                // For new profile, no need to send user_id as it will be handled by the backend
                await djangoAxios.post('profiles/create/', {
                    name: profileData.name,
                    avatar: profileData.avatar,
                    preferences: profileData.preferences || {}
                });
            }
            setIsEditing(false);
            await refreshProfiles();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        }
    };


    return (
        <div className="min-h-screen bg-black text-white p-8 text-center flex flex-col items-center justify-center">
            <div className="max-w-5xl mx-auto ">
                <h1 className="text-3xl font-bold mb-8">Manage Profiles</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {profiles.map(profile => (
                        <motion.div
                            key={profile.id}
                            whileHover={{ scale: 1.05 }}
                            className="relative group"
                        >
                            <img
                                src={profile.avatar || defaultAvatar}
                                alt={profile.name}
                                className="w-24 h-24 md:w-28 md:h-28 xl:w-36 xl:h-36 object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                          transition-opacity flex items-center justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEditProfile(profile)}
                                    className="p-2 bg-white/20 rounded-full"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteProfile(profile.id)}
                                    className="p-2 bg-white/20 rounded-full text-red-500"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </motion.button>
                            </div>
                            <h3 className="text-center mt-2">{profile.name}</h3>
                        </motion.div>
                    ))}

                    {profiles.length < 8 && (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCreateProfile}
                            className="w-24 h-24 md:w-28 md:h-28 xl:w-36 xl:h-36 border-2 border-gray-600 rounded-md 
                                     flex items-center justify-center cursor-pointer
                                     hover:border-gray-400 transition-colors"
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-4xl" />
                        </motion.div>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-2 bg-white text-black rounded-md 
                                 hover:bg-gray-200 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <EditProfileModal
                        profile={editingProfile}
                        onClose={() => setIsEditing(false)}
                        onSave={handleSaveProfile}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
