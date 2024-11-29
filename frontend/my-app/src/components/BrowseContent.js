import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbAxios } from '../axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import ShimmerBrowseContent from './shimmerComps/shimmerBrowseContent';

const baseImgUrl = "https://image.tmdb.org/t/p/w500";

export default function BrowseContent({ searchQuery = "" }) {
    const navigate = useNavigate();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadedImages, setLoadedImages] = useState({});

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const response = await tmdbAxios.get('search/multi', {
                    params: {
                        query: searchQuery,
                        include_adult: false,
                        language: "en-US",
                        page: 1
                    }
                });

                const filteredResults = response.data.results.filter(
                    item => item.media_type !== "person" && item.poster_path
                );

                setContent(filteredResults);
                setError(null);
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to fetch content');
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchContent();
        } else {
            setContent([]);
        }
    }, [searchQuery]);

    const handleItemClick = (item) => {
        navigate(`/${item.media_type}/${item.id}`);
    };

    const handleImageLoad = (itemId) => {
        setLoadedImages(prev => ({
            ...prev,
            [itemId]: true
        }));
    };

    if (loading) {
        return <ShimmerBrowseContent />;
    }

    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-screen flex items-center justify-center"
            >
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg">
                    {error}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-20 min-h-screen bg-black/95"
        >
            <div className="container mx-auto px-4">
                {searchQuery && (
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white mb-8"
                    >
                        Search results for "{searchQuery}"
                    </motion.h1>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10">
                    <AnimatePresence>
                        {content.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group cursor-pointer"
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="relative overflow-hidden rounded-lg">
                                    {!loadedImages[item.id] && (
                                        <div className="absolute inset-0 bg-neutral-800 animate-pulse rounded-lg" />
                                    )}
                                    <motion.img
                                        className={`w-full h-auto rounded-lg transition-all duration-300
                                                  ${loadedImages[item.id] ? 'opacity-100' : 'opacity-0'}`}
                                        src={`${baseImgUrl}${item.poster_path}`}
                                        alt={item.title || item.name}
                                        loading="lazy"
                                        onLoad={() => handleImageLoad(item.id)}
                                        whileHover={{ scale: 1.05 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-white/90"
                                            >
                                                <FontAwesomeIcon icon={faCirclePlay} className="text-5xl" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                                
                                <motion.div 
                                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                >
                                    <h3 className="text-white text-lg font-semibold truncate">
                                        {item.title || item.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-md text-sm" >
                                            <FontAwesomeIcon icon={faStar} />
                                            {item.vote_average?.toFixed(1)}
                                        </span>
                                        <span className="text-gray-400 text-sm capitalize">
                                            {item.media_type}
                                        </span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
