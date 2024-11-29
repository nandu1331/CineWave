// src/components/SearchResults.js
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbAxios } from '../axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faSpinner, 
    faStar, 
    faCalendar, 
    faFilm, 
    faTv,
    faCirclePlay 
} from "@fortawesome/free-solid-svg-icons";
import Navbar from './Navbar-components/Navbar';

const ShimmerItem = () => (
    <div className="animate-pulse bg-neutral-800/30 rounded-lg overflow-hidden">
        <div className="relative aspect-[2/3]">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/50 via-neutral-700/50 to-neutral-800/50 
                          shimmer-animation" />
        </div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-neutral-700/50 rounded w-3/4" />
            <div className="flex gap-2">
                <div className="h-3 bg-neutral-700/50 rounded w-1/4" />
                <div className="h-3 bg-neutral-700/50 rounded w-1/4" />
            </div>
            <div className="h-3 bg-neutral-700/50 rounded w-1/2" />
        </div>
    </div>
);

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loadedImages, setLoadedImages] = useState({});

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20
            }
        }
    };

    const renderShimmerItems = () => {
        return Array(12).fill(0).map((_, index) => (
            <motion.div
                key={`shimmer-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
            >
                <ShimmerItem />
            </motion.div>
        ));
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            try {
                setIsLoading(true);
                const response = await tmdbAxios.get("/search/multi", {
                    params: {
                        query,
                        include_adult: false,
                        language: "en-US",
                        page
                    }
                });

                const filteredResults = response.data.results.filter(
                    item => item.media_type !== "person" && (item.poster_path || item.backdrop_path)
                );

                setResults(prev => page === 1 ? filteredResults : [...prev, ...filteredResults]);
                setTotalResults(response.data.total_results);
                setError(null);
            } catch (error) {
                console.error("Search error:", error);
                setError("Failed to load search results");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, page]);

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-red-500"
            >
                <FontAwesomeIcon icon={faCirclePlay} className="text-5xl mb-4" />
                <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                <p>{error}</p>
            </motion.div>
        );
    }

    return (
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gradient-to-b from-black/95 to-neutral-900">
            <Navbar />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mb-8 mt-12"
            >
                <h1 className="text-4xl font-bold text-white mb-2">
                    Search Results
                </h1>
                <p className="text-gray-400 text-lg">
                    {isLoading && page === 1 
                        ? "Loading results..." 
                        : `Found ${totalResults} results for "${query}"`
                    }
                </p>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-7"
            >
                <AnimatePresence mode="wait">
                    {isLoading && page === 1 
                        ? renderShimmerItems()
                        : results.map((result, index) => (
                            <motion.div
                                key={`${result.id}-${index}`}
                                variants={itemVariants}
                                whileHover="hover"
                                layout
                                className="bg-neutral-800/30 rounded-lg overflow-hidden 
                                         backdrop-blur-sm shadow-lg hover:shadow-xl 
                                         transition-all duration-300"
                            >
                                <Link to={`/${result.media_type}/${result.id}`}>
                                    <div className="relative aspect-[2/3] overflow-hidden">
                                        {!loadedImages[result.id] && (
                                            <div className="absolute inset-0">
                                                <div className="w-full h-full bg-neutral-800/50 shimmer-animation" />
                                            </div>
                                        )}
                                        {result.poster_path ? (
                                            <motion.img
                                                src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                                                alt={result.title || result.name}
                                                className={`w-full h-full object-cover transition-opacity duration-300
                                                          ${loadedImages[result.id] ? 'opacity-100' : 'opacity-0'}`}
                                                loading="lazy"
                                                onLoad={() => handleImageLoad(result.id)}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                                <FontAwesomeIcon 
                                                    icon={result.media_type === 'movie' ? faFilm : faTv} 
                                                    className="text-4xl text-gray-500" 
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent 
                                                  opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <FontAwesomeIcon icon={faCirclePlay} className="text-3xl text-white/90" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2">
                                        {result.title || result.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={result.media_type === 'movie' ? faFilm : faTv} />
                                            {result.media_type === "movie" ? "Movie" : "TV Show"}
                                        </span>
                                        {result.vote_average > 0 && (
                                            <span className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                                {result.vote_average.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                                        {result.release_date || result.first_air_date
                                            ? new Date(result.release_date || result.first_air_date).getFullYear()
                                            : "Release date unknown"}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Loading more results indicator */}
                {isLoading && page > 1 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center p-8"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-red-600" />
                            <p className="text-gray-400">Loading more results...</p>
                        </div>
                    </motion.div>
                )}

                {/* Load more button */}
                {!isLoading && results.length < totalResults && (
                    <motion.button
                        onClick={() => setPage(prev => prev + 1)}
                        className="mx-auto mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 w-fit
                                 rounded-lg transition-all duration-300 flex items-center gap-2
                                 text-white font-semibold shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Load More Results
                    </motion.button>
                )}
        </div>
    );
}
