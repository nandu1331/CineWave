// src/components/MyList.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { djangoAxios } from '../axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faFilm } from "@fortawesome/free-solid-svg-icons";

// Loading skeleton component
const LoadingSkeleton = () => {
    // Create an array of 10 items for the loading state
    const skeletonItems = Array.from({ length: 10 }, (_, i) => i);

    return (
        <div className="container mx-auto px-4 pt-24 min-h-screen">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-3xl font-bold mb-8"
            >
                <div className="h-10 w-32 bg-neutral-800 rounded-md animate-pulse" />
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10">
                {skeletonItems.map((index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative aspect-[2/3] rounded-lg overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-neutral-800 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FontAwesomeIcon 
                                    icon={faFilm} 
                                    className="text-4xl text-neutral-700" 
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default function MyList() {
    const [myList, setMyList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyList();
    }, []);

    // frontend/my-app/src/components/MyList.js
// Update the fetchMyList and removeFromList functions:

const fetchMyList = async () => {
    try {
        const currentProfileId = localStorage.getItem('currentProfileId');
        if (!currentProfileId) {
            setError('No profile selected');
            setLoading(false);
            return;
        }

        const response = await djangoAxios.get(`mylist/?profile_id=${currentProfileId}`);
        setMyList(response.data);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching mylist:', error);
        setError('Failed to fetch your list');
        setLoading(false);
    }
};

const removeFromList = async (itemId) => {
    try {
        const currentProfileId = localStorage.getItem('currentProfileId');
        if (!currentProfileId) {
            setError('No profile selected');
            return;
        }

        await djangoAxios.delete(`mylist/remove/${itemId}/?profile_id=${currentProfileId}`);
        setMyList(myList.filter(item => item.item_id !== itemId));
    } catch (error) {
        console.error('Error removing item from list:', error);
    }
};

    if (loading) return <LoadingSkeleton />;
    
    if (error) return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 pt-24 min-h-screen flex items-center justify-center"
        >
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20">
                {error}
            </div>
        </motion.div>
    );

    return (
        <div className="container mx-auto px-4 pt-24 min-h-screen">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-3xl font-bold mb-8"
            >
                My List
            </motion.h1>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10"
            >
                <AnimatePresence mode="popLayout">
                    {myList.map((item, index) => (
                        <motion.div 
                            key={item.item_id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className='relative group cursor-pointer'    
                        >
                            <Link to={`/${item.media_type}/${item.item_id}`}>
                                <motion.img 
                                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                    alt={item.title}
                                    className="w-full rounded-lg"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>
                            <motion.div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromList(item.item_id);
                                }}
                                className="absolute z-50 right-2 top-2 bg-black/50 hover:bg-black/75
                                         p-2 rounded-md opacity-0 group-hover:opacity-100
                                         cursor-pointer ring-2 ring-red-500 ring-opacity-50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FontAwesomeIcon 
                                    icon={faMinus} 
                                    className="text-lg text-red-500 transition-all duration-300 ease-in-out"
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
