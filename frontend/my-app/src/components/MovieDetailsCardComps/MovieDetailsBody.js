import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCalendar, faClock, faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { tmdbAxios } from "../../axios";
import { djangoAxios } from "../../axios";
import RecommendationCard from "./RecommendationCard";
import SeasonDetails from "./SeasonDetails";
import { Link } from "react-router-dom";


export default function DetailsBody({ details, mediaType, isFullPage }) {
    const [recommendations, setRecommendations] = useState([]);
    const [isInList, setIsInList] = useState(false);
    const [isAddingToList, setIsAddingToList] = useState(false);

     useEffect(() => {
        window.scrollTo(0, 0);
    }, [details]);
    
    useEffect(() => {
        const checkIfInList = async () => {
            if (details?.id) {
                try {
                    const response = await djangoAxios.get('mylist/');
                    const isMovieInList = response.data.some(item => 
                        item.movie_id === details.id
                    );
                    setIsInList(isMovieInList);
                } catch (error) {
                    console.error('Error checking list status:', error);
                }
            }
        };
        
        checkIfInList();

    }, [details?.id]);

     const handleListAction = async () => {
        if (!details?.id) return;

        setIsAddingToList(true);
        try {
            if (isInList) {
                // Remove from list
                await djangoAxios.delete(`mylist/remove/${details.id}/`);
                setIsInList(false);
            } else {
                // Add to list
                const movieData = {
                    movie_id: details.id,
                    title: details.title || details.name,
                    poster_path: details.poster_path,
                    media_type: mediaType
                };
                await djangoAxios.post('mylist/add/', movieData);
                setIsInList(true);
            }
        } catch (error) {
            if (error.response?.data?.non_field_errors?.[0].includes('unique set')) {
                // Item already in list
                setIsInList(true);
            } else {
                console.error('Error updating list:', error);
            }
        } finally {
            setIsAddingToList(false);
        }
    };

    const listButtonClasses = `
        flex items-center gap-2 px-4 py-2 rounded-md
        transition-all duration-300
        ${isInList 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-white text-black hover:bg-gray-200'}
    `;

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
            
            <div className="flex gap-4 mt-4 lg:gap-12">
                <button className='flex items-center gap-2 px-4 py-2 rounded-md
                                    transition-all duration-300 bg-white text-black hover:bg-gray-200'
                >
                    Play
                </button>
                <button
                    onClick={handleListAction}
                    disabled={isAddingToList}
                    className={listButtonClasses}
                >
                    <FontAwesomeIcon 
                        icon={isInList ? faCheck : faPlus} 
                        className={isAddingToList ? 'animate-spin' : ''}
                    />
                    {isInList ? 'Remove from List' : 'Add to List'}
                </button>
                {/* Your other button */}
            </div>

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
                {mediaType === 'movie' && <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-green-400" />
                    <span>{formatRunTime(details?.runtime)}</span>
                </div>}
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
            {mediaType === 'tv' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <SeasonDetails id={details?.id}/>
                </motion.div>
            )}

            <motion.strong className="text-2xl">
                About the Movie
            </motion.strong>
            {mediaType === 'movie' ? 
                <span className="flex gap-2 font-semibold">Release Date: <p className="font-normal">{details?.release_date || "NaN"}</p></span>
                :
                <div>
                    <motion.span className="flex gap-2 font-semibold">First Air Date:  <p className="font-normal">{details.first_air_date || "NaN"}</p></motion.span>
                    <motion.span className="flex gap-2 font-semibold">Last Air Date:  <p className="font-normal">{details.last_air_date || "NaN"}</p></motion.span>
                </div>
            }
            <motion.span className="flex gap-2 font-semibold">Produced By:</motion.span>
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
            <motion.strong 
                variants={itemVariants}
                className="text-2xl md:text-3xl mt-5 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
            >
                More like this : 
            </motion.strong>

            {/* Recommendations Grid */}
            <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-4 lg:gap-6"
            >
                <AnimatePresence>
                    {recommendations?.slice(0, 9).map((item, index) => (
                        <Link to={`/${item.media_type}/${item.id}`} >
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
                        </Link>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}