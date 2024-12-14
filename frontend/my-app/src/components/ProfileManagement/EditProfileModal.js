// frontend/my-app/src/components/ProfileManagement/EditProfileModal.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCamera } from '@fortawesome/free-solid-svg-icons';
import { defaultAvatars, defaultAvatar } from '../../constants/avatarImages';
import useProfiles from '../../hooks/useProfiles';

export default function EditProfileModal({ profile, onClose, onSave }) {
    const { refreshProfiles } = useProfiles();
    const [profileData, setProfileData] = useState({
        ...profile,
        name: profile?.name || '',
        avatar: profile?.avatar || defaultAvatar,
        preferences: profile?.preferences || {}
    });
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!profileData.name.trim()) {
            alert('Please enter a profile name');
            return;
        }
        onSave(profileData);
        await refreshProfiles();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-zinc-900 rounded-lg max-w-xl w-full p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        {profile?.id ? 'Edit Profile' : 'Create Profile'}
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </motion.button>
                </div>

                <form onSubmit={handleSave}>
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group">
                            <img
                                src={profileData.avatar || defaultAvatar}
                                alt="Profile Avatar"
                                className="w-32 h-32 rounded-lg object-cover"
                            />
                            <motion.div
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/60 opacity-0 
                                          flex items-center justify-center rounded-lg
                                          cursor-pointer"
                                onClick={() => setShowAvatarSelect(true)}
                            >
                                <FontAwesomeIcon icon={faCamera} className="text-2xl" />
                            </motion.div>
                        </div>

                        {showAvatarSelect && (
                            <div className="mt-6 grid grid-cols-4 gap-3">
                                {defaultAvatars.map((avatar, index) => (
                                    <motion.img
                                        key={index}
                                        src={avatar}
                                        alt={`Avatar ${index + 1}`}
                                        className={`w-20 h-20 rounded-md cursor-pointer
                                                  ${profileData.avatar === avatar ? 'ring-2 ring-red-500' : ''}`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setProfileData({ ...profileData, avatar });
                                            setShowAvatarSelect(false);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Profile Name
                        </label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ 
                                ...profileData, 
                                name: e.target.value 
                            })}
                            className="w-full px-4 py-2 bg-zinc-800 rounded-md
                                     focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter profile name"
                            maxLength={50}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <motion.button
                            type="button"
                            onClick={onClose}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-gray-400 hover:text-white"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md
                                     hover:bg-red-700 transition-colors"
                        >
                            Save
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
