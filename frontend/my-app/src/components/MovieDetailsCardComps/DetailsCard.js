import React, { useState, useEffect, useCallback, Suspense, memo } from "react";
import PropTypes from 'prop-types';
import { tmdbAxios } from "../../axios";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load components
const DetailsHero = React.lazy(() => import("./DetailsHero"));
const DetailsBody = React.lazy(() => import("./MovieDetailsBody"));

// Shimmer Components remain mostly the same but with added animations
const HeroShimmer = memo(({ isFullPage }) => {
    const containerClasses = isFullPage 
        ? "w-full h-[500px]" 
        : "w-full h-[400px]";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${containerClasses} bg-neutral-800 animate-pulse relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-700 via-neutral-600 to-neutral-700 shimmer"></div>
        </motion.div>
    );
});

const BodyShimmer = memo(({ isFullPage }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-4"
        >
            {[1, 2, 3, 4].map((item) => (
                <div 
                    key={item} 
                    className="w-full h-20 bg-neutral-800 animate-pulse rounded-md relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-700 via-neutral-600 to-neutral-700 shimmer"></div>
                </div>
            ))}
        </motion.div>
    );
});

const MovieDetailsCard = ({ movieId, onClose, mediaType }) => {
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    
    // Use either props or params, with props taking precedence
    const activeId = movieId || params?.id;
    const activeMediaType = mediaType || params?.media_type;
    const isFullPage = !movieId && params?.id;

    // Memoized fetch function
    const fetchDetails = useCallback(async () => {
        if (!activeId) return;

        setIsLoading(true);
        setError(null);

        try {
            // Check cache first
            const cacheKey = `movie_details_${activeId}_${activeMediaType}`;
            const cachedData = sessionStorage.getItem(cacheKey);
            
            if (cachedData) {
                setMovieDetails(JSON.parse(cachedData));
                setIsLoading(false);
                return;
            }

            const mediaTypeFormatted = activeMediaType?.toLowerCase();
            const endpoint = mediaTypeFormatted === 'movie' ? 'movie' : 'tv';
            
            const response = await tmdbAxios.get(`${endpoint}/${activeId}`);
            const data = response.data;

            // Cache the response
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            setMovieDetails(data);
        } catch (error) {
            console.error("Error fetching details:", error);
            setError("Failed to load content. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [activeId, activeMediaType]);

    // Effect for fetching details
    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // Effect for body overflow
    useEffect(() => {
        if (!isFullPage) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isFullPage]);

    if (!activeId || !activeMediaType) {
        return null;
    }

    const containerClassName = isFullPage
        ? "min-h-screen bg-black w-[100%]"
        : "fixed inset-0 pt-32 z-10 items-center text-white bg-black bg-opacity-80 justify-center overflow-y-auto";

    const contentClassName = isFullPage
        ? "w-full max-w-full mx-auto px-3"
        : "relative w-11/12 md:w-9/12 lg:w-7/12 max-w-4xl mx-auto z-20 bg-neutral-900 rounded-lg shadow-2xl overflow-y-auto";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${containerClassName} text-white`}
        >
            <div className={`${contentClassName} text-white`}>
                <AnimatePresence>
                    {!isFullPage && (
                        <motion.button 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            onClick={onClose}
                            className="absolute top-2 right-2 z-50 
                                     text-white hover:text-gray-300 
                                     bg-neutral-800 rounded-full 
                                     w-10 h-10 flex items-center justify-center
                                     transition-all duration-300 hover:bg-neutral-700"
                        >
                            ✕
                        </motion.button>
                    )}
                </AnimatePresence>

                {error ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 text-center"
                    >
                        <div className="text-red-500 mb-4">{error}</div>
                        <button 
                            onClick={fetchDetails}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700
                                     transition-colors duration-300"
                        >
                            Try Again
                        </button>
                    </motion.div>
                ) : (
                    <Suspense fallback={
                        <>
                            <HeroShimmer isFullPage={isFullPage} />
                            <BodyShimmer isFullPage={isFullPage} />
                        </>
                    }>
                        {isLoading ? (
                            <>
                                <HeroShimmer isFullPage={isFullPage} />
                                <BodyShimmer isFullPage={isFullPage} />
                            </>
                        ) : (
                            <>
                                <DetailsHero 
                                    details={movieDetails} 
                                    mediaType={activeMediaType === 'movie' ? 'movie' : 'tv'}
                                    isFullPage={isFullPage}
                                />
                                <DetailsBody 
                                    details={movieDetails} 
                                    mediaType={activeMediaType?.toLowerCase() === 'movie' ? 'movie' : 'tv'}
                                    isFullPage={isFullPage}
                                />
                            </>
                        )}
                    </Suspense>
                )}
            </div>
        </motion.div>
    );
};

MovieDetailsCard.propTypes = {
    movieId: PropTypes.string,
    onClose: PropTypes.func,
    mediaType: PropTypes.oneOf(['movie', 'tv', 'MOVIE', 'TV']),
};

export default memo(MovieDetailsCard);
