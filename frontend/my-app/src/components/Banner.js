import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import tmdbAxios from "axios";
import requests from "../requests";
import ShimmerBanner from "./shimmerComps/shimmerBanner";
import VideoPlayer from "./VideoPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeOff } from "@fortawesome/free-solid-svg-icons";

export default function Banner() {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trailer, setTrailer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(0); // Start muted
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
    const [movieTitle, setMovieTitle] = useState(null);
    const videoRef = useRef(null);
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const apikey = process.env.REACT_APP_API_KEY;
    
    const fetchMovieLogo = async (movieId) => {
    try {
        const imagesEndPoint = `https://api.themoviedb.org/3/movie/${movieId}/images`;
        const imagesResponse = await tmdbAxios.get(imagesEndPoint, {
            params: {
                api_key: apikey,
            }
        });

        const logos = imagesResponse.data.logos;
        if (logos && logos.length > 0) {
            // Just get the first English logo, or fallback to any logo
            const englishLogo = logos.find(logo => logo.iso_639_1 === 'en');
            const selectedLogo = englishLogo || logos[0];
            const logoPath = `https://image.tmdb.org/t/p/original${selectedLogo.file_path}`;
            setMovieTitle(logoPath);
        } else {
            // If no logos available, fall back to null (will show text title)
            setMovieTitle(null);
        }
    } catch (error) {
        console.error("Error fetching movie logo:", error);
        setMovieTitle(null);
    }
};


    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
            if (window.innerWidth < 1024) {
                setIsPlaying(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Fetch initial movie data
    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const url = `https://api.themoviedb.org/3/${requests.fetchPopular}`;
                const res = await tmdbAxios.get(url, {
                    params: {
                        api_key: apikey,
                        ...requests.params,
                    },
                });
                const randomMovie = res.data.results[Math.floor(Math.random() * res.data.results.length)];
                const detailedMovieRes = await tmdbAxios.get(`https://api.themoviedb.org/3/movie/${randomMovie.id}`, {
                    params: {
                        api_key: apikey,
                    }
                }); 
                
                const movieData = detailedMovieRes.data;
                setMovie(movieData);

                // Fetch logo and trailer for the same movie
                await Promise.all([
                    fetchMovieLogo(movieData.id),
                    fetchMovieTrailer(movieData.id)
                ]);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };
        fetchMovie();
    }, [apikey]);

    // Fetch movie trailer
    const fetchMovieTrailer = async (movieId) => {
        try {
            const endpoint = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apikey}`;
            const response = await tmdbAxios.get(endpoint);
            const trailerPriorities = [
                video => video.type === 'Trailer' && video.site === 'YouTube' && video.official === true,
                video => video.type === 'Trailer' && video.site === 'YouTube',
                video => video.type === 'Teaser' && video.site === 'YouTube'
            ];

            for (let priority of trailerPriorities) {
                const matchingTrailer = response.data.results?.find(priority);
                if (matchingTrailer) {
                    setTrailer(matchingTrailer);
                    break;
                }
            }
        } catch (error) {
            console.error("Error fetching trailer:", error);
        }
    };

    // Auto-play trailer after delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPlaying(true);
        }, 3000); // 3 second delay before playing

        return () => clearTimeout(timer);
    }, [movie]);

    const handleBannerClick = () => {
        if (isLargeScreen) {
            setIsPlaying(!isPlaying);
        }
    };

    if (loading) {
        return <ShimmerBanner />;
    }

    return (
        <motion.header 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[60vh] md:h-[80vh] lg:h-[95vh] w-full overflow-hidden"
            onClick={handleBannerClick}
        >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

            {/* Video/Image Container */}
            <AnimatePresence initial={false} >
                {(!isPlaying || !trailer || !isLargeScreen) ? (
                    <motion.div
                        key="image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 "
                        
                    >
                        <img
                            src={`${baseImgUrl}${movie?.backdrop_path}`}
                            alt={movie?.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="video"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <VideoPlayer
                            id={movie?.id}
                            isPlaying={isPlaying}
                            setIsPlaying={setIsPlaying}
                            videoRef={videoRef}
                            mediaType="movie"
                            trailer={trailer}
                            setTrailer={setTrailer}
                            volume={audio}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute inset-y-64 md:inset-y-2/3 lg:inset-y-2/3 z-10">
                <div className="container mx-auto h-full flex flex-col justify-center px-4 md:px-8 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="max-w-2xl space-y-3"
                    >
                        {movieTitle ? (
                            <motion.div 
                                className="w-[150px] md:w-[300px] lg:w-[400px] mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                <img 
                                    src={movieTitle} 
                                    alt={movie?.title}
                                    className="w-full h-auto object-contain"
                                    loading="lazy"
                                />
                            </motion.div>
                        ) : (
                            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white">
                                {movie?.title}
                            </h1>
                        )}
                        <p className="text-[14px] md:text-md lg:text-lg text-gray-200 line-clamp-3">
                            {movie?.overview}
                        </p>
                        <div className="flex items-center gap-4 pt-4 w-fit">
                            <button 
                                className="bg-white text-black px-8 py-2 rounded-md flex items-center gap-2 hover:bg-white/90 transition"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                Play
                            </button>
                            <button 
                                onClick={() => setAudio(audio ? 0 : 1)}
                                className="bg-gray-500/50 text-white px-8 py-2 rounded-md hover:bg-gray-600/50 transition"
                            >
                                Details
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Volume Control Button - Only visible on large screens */}
            {isLargeScreen && (
                <div 
                    className="absolute bottom-[16px] right-[100px] lg:bottom-[110px] lg:right-[120px] z-30"
                    onClick={(e) => {
                        e.stopPropagation();
                        setAudio(prev => !prev);
                    }}
                >
                    <FontAwesomeIcon 
                        icon={audio ? faVolumeHigh : faVolumeOff} 
                        className="text-white text-2xl cursor-pointer transition-transform transform hover:scale-110"
                    />
                </div>
            )}

            {/* Age Rating Indicator - Only visible on large screens */}
            {isLargeScreen && (
                <div className="bg-black bg-opacity-25 border-white border-l-[5px] w-fit right-0 top-[75%] md:top-[82%] lg:top-[79%] absolute pr-12 px-2 py-2 rounded-lg z-30">
                    <h1 className="text-white text-lg font-semibold">{movie?.adult ? '18+' : 'Any'}
                    </h1>
                </div>
            )}
        </motion.header>
    );
}
