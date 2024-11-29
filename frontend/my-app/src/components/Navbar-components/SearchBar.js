// src/components/Navbar-components/SearchBar.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { tmdbAxios } from "../../axios";
import useDebounce from "../../hooks/useDebounce";

export default function SearchBar({ isMobile }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedSearchQuery.trim()) {
                setSearchResults([]);
                setShowResults(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await tmdbAxios.get("/search/multi", {
                    params: {
                        query: debouncedSearchQuery,
                        include_adult: false,
                        language: "en-US",
                        page: 1
                    }
                });

                const filteredResults = response.data.results
                    .filter(item => item.media_type !== "person")
                    .slice(0, 6);

                setSearchResults(filteredResults);
                setShowResults(true);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [debouncedSearchQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/browse/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowResults(false);
            setSearchQuery("");
            setIsFocused(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setShowResults(false);
        inputRef.current?.focus();
    };

    return (
        <motion.div 
            className={`relative ${isMobile ? 'w-full' : 'w-auto'}`}
            ref={searchRef}
            animate={{ width: isFocused ? (isMobile ? "100%" : "300px") : (isMobile ? "100%" : "240px") }}
            transition={{ duration: 0.3 }}
        >
            <form 
                onSubmit={handleSearchSubmit}
                className="relative flex items-center"
            >
                <motion.div
                    className="relative w-full rounded-full"
                    animate={{ 
                        scale: isFocused ? 1.02 : 1,
                        boxShadow: isFocused ? "0 0 10px rgba(255,255,255,0.2)" : "none"
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Search titles..."
                        className="w-full px-4 py-2 bg-neutral-900/90 border border-gray-600 
                                 rounded-full focus:outline-none focus:border-white/50
                                 text-white placeholder-gray-400 pr-12
                                 transition-all duration-300"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {searchQuery && (
                            <motion.div
                                onClick={clearSearch}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="text-gray-400 hover:text-white p-1 cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </motion.div>
                        )}
                        <motion.div
                            className="text-gray-400 hover:text-white p-1 cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isLoading ? (
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            ) : (
                                <FontAwesomeIcon icon={faSearch} />
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </form>

            <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full mt-2 w-full bg-neutral-900/95 
                                 border border-gray-800 rounded-xl shadow-xl 
                                 backdrop-blur-md overflow-auto
                                 scrollbar-thin scrollbar-track-neutral-800 
                                 scrollbar-thumb-red-600 hover:scrollbar-thumb-red-500
                                scrollbar-thumb-rounded-full scrollbar-track-rounded-full
                                 ${isMobile ? 'max-h-[90vh]' : 'max-h-[70vh]'}`}
                    >
                        {searchResults.map((result, index) => (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/${result.media_type}/${result.id}`}
                                    onClick={() => {
                                        setShowResults(false);
                                        setSearchQuery("");
                                        setIsFocused(false);
                                    }}
                                    className="flex items-center p-3 hover:bg-white/5
                                             transition-colors duration-200"
                                >
                                    {result.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                                            alt={result.title || result.name}
                                            className="w-12 h-16 object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="w-12 h-16 bg-neutral-800 rounded-md
                                                      flex items-center justify-center text-sm text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <div className="ml-3 flex-1">
                                        <h4 className="text-white font-medium">
                                            {result.title || result.name}
                                        </h4>
                                        <p className="text-sm text-gray-400">
                                            {result.media_type === "movie" ? "Movie" : "TV Show"} • 
                                            {result.release_date || result.first_air_date 
                                                ? new Date(
                                                    result.release_date || result.first_air_date
                                                  ).getFullYear()
                                                : "Release date unknown"
                                            }
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        <Link
                            to={`/browse/search?q=${encodeURIComponent(searchQuery.trim())}`}
                            onClick={() => {
                                setShowResults(false);
                                setSearchQuery("");
                                setIsFocused(false);
                            }}
                            className="block w-full p-3 text-center text-gray-400 
                                     hover:text-white hover:bg-white/5 
                                     transition-all duration-200 border-t 
                                     border-gray-800/50"
                        >
                            <motion.div
                                className="flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FontAwesomeIcon icon={faSearch} className="text-sm" />
                                <span>See all results</span>
                            </motion.div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
