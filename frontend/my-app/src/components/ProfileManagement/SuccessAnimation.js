import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { defaultAvatar } from '../../constants/avatarImages';

const SuccessScreen = ({ selectedProfile }) => {
    return (
        <motion.div
            key="success-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
        >
            <div className="text-center space-y-2">
                {/* Profile Avatar Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                        type: "spring",
                        duration: 1,
                        bounce: 0.5
                    }}
                >
                    <img 
                        src={selectedProfile?.avatar || defaultAvatar}
                        alt={selectedProfile?.name}
                        className="w-24 h-24 rounded-lg mx-auto border-2 border-red-600"
                    />
                </motion.div>

                {/* Success Check Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        duration: 0.8,
                        delay: 0.3
                    }}
                    className="success-check-wrapper"
                >
                    <svg 
                        className="success-check-icon" 
                        viewBox="0 0 24 24"
                    >
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            d="M3,12 L9,18 L21,6"
                            stroke="#E50914"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </motion.div>

                {/* Welcome Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                >
                    <h2 className="text-3xl font-bold text-white">
                        Welcome back, {selectedProfile?.name}!
                    </h2>
                    <p className="text-xl text-gray-300">
                        Get ready for your personalized experience
                    </p>
                </motion.div>

                {/* Loading Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="space-y-4"
                >
                    <div className="flex justify-center space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [-10, 10],
                                    backgroundColor: ['#E50914', '#831010']
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: i * 0.15
                                }}
                                className="w-3 h-3 rounded-full bg-red-600"
                            />
                        ))}
                    </div>
                    <p className="text-gray-400 italic">
                        Loading your recommendations...
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SuccessScreen;