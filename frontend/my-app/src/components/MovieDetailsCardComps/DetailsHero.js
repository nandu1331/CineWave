import React, { useState, useEffect, useRef } from "react";
import VideoPlayer from "../VideoPlayer";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeOff } from "@fortawesome/free-solid-svg-icons";
import { tmdbAxios } from "../../axios";

export default function DetailsHero({ details, mediaType }) {
    const [trailer, setTrailer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(1);
    const [movieTitle, setMovieTitle] = useState(null);
    const videoRef = useRef(null);
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const imageUrl = `${baseImgUrl}${details?.backdrop_path}`;
    const API_KEY = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        async function fetchTrailer() {
            try {
                const endpoint = mediaType === "movie" ? 
                    `movie/${details.id}/videos` : 
                    `tv/${details.id}/videos`;
                
                const response = await tmdbAxios.get(endpoint, {
                    params: {
                        api_key: API_KEY
                    }
                });

                const data = response.data;
                
                // Priority order for trailer selection
                const trailerPriorities = [
                    // First, look for official trailers in English
                    video => video.type === 'Trailer' && 
                             video.site === 'YouTube' && 
                             video.official === true && 
                             (video.iso_639_1 === 'en' || !video.iso_639_1),
                    
                    // Then, any official trailer
                    video => video.type === 'Trailer' && 
                             video.site === 'YouTube' && 
                             video.official === true,
                    
                    // Then, any trailer in English
                    video => video.type === 'Trailer' && 
                             video.site === 'YouTube' && 
                             (video.iso_639_1 === 'en' || !video.iso_639_1),
                    
                    // Finally, any trailer
                    video => video.type === 'Trailer' && 
                             video.site === 'YouTube'
                ];

                // Find the first matching trailer
                for (let priority of trailerPriorities) {
                    const matchingTrailer = data.results?.find(priority);
                    if (matchingTrailer) {
                        setTrailer(matchingTrailer);
                        break;
                    }
                }

            } catch (error) {
                console.error("Error fetching trailer:", error);
                setTrailer(null);
            }
        }

        // Fetch trailer when details and ID are available
        if (details?.id) {
            fetchTrailer();
        }
    }, [details?.id, mediaType, API_KEY]);

    // Logo fetching logic (as in previous response)
    useEffect(() => {
        async function fetchMovieLogo() {
            try {
                const imagesEndPoint = mediaType === "movie" ?
                    `movie/${details.id}/images` :
                    `tv/${details.id}/images`;
                
                const imagesResponse = await tmdbAxios.get(imagesEndPoint, {
                    params: {
                        api_key: API_KEY,
                        include_image_language: 'en,null'
                    }
                });

                const logos = imagesResponse.data.logos;
                if (logos && logos.length > 0) {
                    const filteredLogos = logos
                        .filter(logo => {
                            const aspectRatio = logo.aspect_ratio;
                            return aspectRatio >= 1.5 && aspectRatio <= 4;
                        })
                        .filter(logo => {
                            return logo.width >= 400 && logo.height >= 100;
                        })
                        .sort((a, b) => {
                            const getScore = (logo) => {
                                let score = 0;                                
                                score += logo.vote_average * 10;                   
                                score += Math.min(logo.width, 1000) / 100;                            
                                const idealAspectRatio = 2.5;
                                score -= Math.abs(logo.aspect_ratio - idealAspectRatio) * 5;
                                return score;
                            };

                            return getScore(b) - getScore(a);
                        });

                    if (filteredLogos.length > 0) {
                        const bestLogo = filteredLogos[0];
                        const logoPath = `https://image.tmdb.org/t/p/original${bestLogo.file_path}`;
                        setMovieTitle(logoPath);
                    } else {
                        // Fallback to poster if no suitable logo found
                        const fallbackLogo = `https://image.tmdb.org/t/p/w500/${details?.poster_path}`;
                        setMovieTitle(fallbackLogo);
                    }
                } else {
                    // Fallback to poster if no logos found
                    const fallbackLogo = `https://image.tmdb.org/t/p/w500/${details?.poster_path}`;
                    setMovieTitle(fallbackLogo);
                }
            } catch (error) {
                console.error("Error fetching movie logo:", error);
                // Fallback to poster if logo fetch fails
                const fallbackLogo = `https://image.tmdb.org/t/p/w500/${details?.poster_path}`;
                setMovieTitle(fallbackLogo);
            }
        }

        if (details?.id) {
            fetchMovieLogo();
        }
    }, [details?.id, mediaType, API_KEY]);

    useEffect(() => {
        const autoPlayTimer = setTimeout(() => {
            setIsPlaying(true);
        }, 3000);
        return () => clearTimeout(autoPlayTimer);
    }, []);

    const handleClick = () => {
        setIsPlaying(prev => !prev);
    };

    return (
        <div className="relative h-[30vh] w-full md:h-[40vh] lg:h-[50vh] overflow-hidden">
            <AnimatePresence initial={false}>
                {!isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="relative h-full w-full overflow-hidden bg-cover"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                        onClick={handleClick}
                    >
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="h-full w-full overflow-hidden"
                        onClick={handleClick}
                    >
                        <VideoPlayer 
                            id={details.id}
                            isPlaying={isPlaying}
                            setIsPlaying={setIsPlaying}
                            videoRef={videoRef}
                            setMovieTitle={() => {}} // No-op function
                            mediaType={mediaType}
                            trailer={trailer}
                            setTrailer={setTrailer}
                            volume={audio ? 1 : 0}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {movieTitle && (
                <div className="absolute bottom-10 left-7 max-w-[175px]">
                    <img 
                        src={movieTitle} 
                        alt="Movie Logo"
                        className="w-full h-auto object-contain"
                    />
                </div>
            )}

            {/* Volume Control Button */}
            <div className="absolute bottom-[53px] right-[100px] z-10">
                <FontAwesomeIcon 
                    icon={audio ? faVolumeHigh : faVolumeOff} 
                    onClick={() => setAudio(prev => !prev)}
                    className="text-4xl cursor-pointer transition-transform transform hover:scale-110"
                />
            </div>
            <div className="bg-black bg-opacity-25 border-white border-l-[5px] w-fit right-0 top-[75%] absolute pr-12 px-2 py-2">
                <h1>{details?.adult ? '18+' : 'Any'}</h1>
            </div>
        </div>
    );
}