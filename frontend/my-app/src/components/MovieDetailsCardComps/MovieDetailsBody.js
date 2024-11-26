import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { tmdbAxios } from "../../axios";
import RecommendationCard from "./RecommendationCard";

export default function DetailsBody({ details, mediaType }) {
    const [recommendations, setRecommendations] = useState([]);

    const formatRunTime = (runtime) => {
        if (!runtime) return "N/A";
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours}h ${minutes}m`;
    };

    useEffect(() => {
        const fetchRecommendations = async (id) => {
            try {
                const response = await tmdbAxios.get(`/${mediaType}/${id}/recommendations`);
                setRecommendations(response.data.results);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            }
        };

        if (details?.id) {
            fetchRecommendations(details.id);
        }
    }, [details, mediaType]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-4 md:p-7 flex flex-col gap-6 bg-gradient-to-br from-neutral-900 to-black text-white rounded-2xl shadow-2xl"
        >
            {/* Title Section */}
            <motion.h1 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
            >
                {details?.title || details?.original_title || details?.name}
            </motion.h1>

            {/* Movie Info */}
            <motion.div 
                variants={itemVariants}
                className="flex flex-wrap items-center gap-4 text-sm md:text-base"
            >
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                    <span>{details.vote_average?.toFixed(1) || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-blue-400" />
                    <span>{(details.release_date || details.first_air_date)?.split('-')[0] || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-green-400" />
                    <span>{formatRunTime(details?.runtime)}</span>
                </div>
            </motion.div>

            {/* Genres */}
            <motion.div 
                variants={itemVariants}
                className="flex flex-wrap items-center gap-2"
            >
                {details.genres?.map((genre) => (
                    <motion.div
                        key={genre.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-neutral-800/50 backdrop-blur-sm rounded-full text-sm text-gray-300 hover:bg-neutral-700 transition-all duration-300"
                    >
                        {genre.name}
                    </motion.div>
                ))}
            </motion.div>

            {/* Overview */}
            <motion.p 
                variants={itemVariants}
                className="text-base md:text-lg text-gray-300 leading-relaxed"
            >
                {details.overview || "No overview available."}
            </motion.p>
            <motion.strong>
                About the Movie
            </motion.strong>
            <motion.span className="flex gap-2">Release Date: <p className="font-semibold">{details.release_date || "NaN"}</p></motion.span>
            <motion.h3>Produced By:</motion.h3>
            <motion.p className="flex flex-wrap text-white text-sm">
               {Array.isArray(details.production_companies) && details.production_companies.length > 0 ? (
                   details.production_companies
                       .map(company => company?.name)
                       .filter(name => name) // Filter out any undefined or null names
                       .map((name, index) => (
                           <span key={index} className="mr-2">
                               {name}{index < details.production_companies.length - 1 ? ' - ' : ''}
                           </span>
                       ))
               ) : (
                   <span>No production companies available.</span> // Fallback message
               )}
            </motion.p>

            {/* Recommendations Section */}
            <motion.h2 
                variants={itemVariants}
                className="text-2xl md:text-3xl font-semibold mt-5 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
            >
                More like this : 
            </motion.h2>

            {/* Recommendations Grid */}
            <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 lg:gap-6"
            >
                <AnimatePresence>
                    {recommendations?.slice(0, 9).map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ 
                                duration: 0.3,
                                delay: index * 0.1
                            }}
                        >
                            <RecommendationCard 
                                title={item?.name || item?.title || item?.original_title}
                                poster={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                                rating={item.vote_average?.toFixed(1) || "N/A"}
                                releaseYear={(item.release_date || item.first_air_date)?.split('-')[0] || "N/A"}
                                overview={item?.overview}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}