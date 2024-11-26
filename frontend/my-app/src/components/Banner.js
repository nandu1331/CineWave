import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import tmdbAxios from "axios";
import requests from "../requests";
import ShimmerBanner from "./shimmerComps/shimmerBanner";

export default function Banner() {
    const [movie, setMovie] = useState(null); 
    const [loading, setLoading] = useState(true);
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const apikey = process.env.REACT_APP_API_KEY

    React.useEffect(() => {
        setLoading(true);
        const url = `https://api.themoviedb.org/3/${requests.fetchPopular}`;
        tmdbAxios
            .get(url, {
                params: {
                    api_key: `${apikey}`, 
                    ...requests.params, 
                },
            })
            .then(res => {
                const randomMovie = res.data.results[Math.floor(Math.random() * res.data.results.length)];
                setMovie(randomMovie);
                setLoading(false); 
            })
            .catch(err => console.error("Error fetching data:", err)); 
    }, []);

    const imageUrl = `${baseImgUrl}${movie?.backdrop_path}`

    // Animation variants
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

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3
            }
        },
        tap: {
            scale: 0.95
        }
    };

    if (loading) {
        return <ShimmerBanner />
    }

    return (
        <motion.header 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-screen w-full overflow-hidden"
            style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 container p-4 lg:px-20 h-full flex flex-col justify-center"
            >
                <motion.h1 
                    variants={itemVariants}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-2xl"
                >
                    {movie?.title}
                </motion.h1>

                <motion.p 
                    variants={itemVariants}
                    className="text-md md:text-xl lg:text-lg text-gray-200 mb-8 max-w-xl"
                >
                    {movie?.overview}
                </motion.p>

                <motion.div 
                    variants={itemVariants}
                    className="flex space-x-4 min-w-fit max-w-96"
                >
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Play
                    </motion.button>

                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-gray-500/50 text-white px-6 py-3 rounded-lg hover:bg-gray-600/50 transition"
                    >
                        More Info
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Bottom Gradient */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"
            />
        </motion.header>
    );
}