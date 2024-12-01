import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import VideoPlayer from "../VideoPlayer";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeOff } from "@fortawesome/free-solid-svg-icons";
import { tmdbAxios } from "../../axios";

// DetailsHero.js
export default function DetailsHero({ details, mediaType, isFullPage }) {
    const [trailer, setTrailer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [movieTitle, setMovieTitle] = useState(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const backdropUrl = `${baseImgUrl}${details?.backdrop_path}`;
    const posterUrl = `${baseImgUrl}${details?.poster_path}`;

    // Memoized trailer priorities
    const trailerPriorities = useMemo(() => [
        // Priority 1: Official English Trailer
        video => ({
            score: 100,
            match: video.type?.toLowerCase().includes('trailer') &&
                   video.official === true &&
                   (video.iso_639_1 === 'en' || !video.iso_639_1) &&
                   video.site === 'YouTube' &&
                   video.key
        }),
        // Priority 2: Official Trailer (any language)
        video => ({
            score: 80,
            match: video.type?.toLowerCase().includes('trailer') &&
                   video.official === true &&
                   video.site === 'YouTube' &&
                   video.key
        }),
        // Priority 3: Any Trailer
        video => ({
            score: 60,
            match: video.type?.toLowerCase().includes('trailer') &&
                   video.site === 'YouTube' &&
                   video.key
        })
    ], []);

    // Fetch trailer with better error handling
    const fetchTrailer = useCallback(async () => {
        if (!details?.id) return;

        try {
            const tmdbEndpoint = `${mediaType}/${details.id}/videos`;
            const response = await tmdbAxios.get(tmdbEndpoint);
            const videos = response.data.results || [];

            // Score and sort videos based on priorities
            const scoredVideos = videos.map(video => {
                const priority = trailerPriorities.find(p => p(video).match);
                return {
                    ...video,
                    score: priority ? priority(video).score : 0
                };
            });

            const sortedVideos = scoredVideos.sort((a, b) => b.score - a.score);

            if (sortedVideos.length > 0) {
                setTrailer(sortedVideos[0]);
            } else {
                // Fallback search
                const fallbackSearch = await tmdbAxios.get(`search/${mediaType}`, {
                    params: {
                        query: details.title || details.name,
                        year: new Date(details.release_date || details.first_air_date).getFullYear()
                    }
                });

                const alternativeId = fallbackSearch.data.results?.[0]?.id;
                if (alternativeId && alternativeId !== details.id) {
                    const alternativeVideos = await tmdbAxios.get(`${mediaType}/${alternativeId}/videos`);
                    const fallbackVideo = alternativeVideos.data.results?.find(v => 
                        v.site === 'YouTube' && 
                        v.type?.toLowerCase().includes('trailer')
                    );
                    
                    if (fallbackVideo) {
                        setTrailer(fallbackVideo);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching trailer:", error);
            setError("Failed to load trailer");
        }
    }, [details?.id, mediaType, trailerPriorities]);

    // Fetch movie logo with better error handling
    const fetchMovieLogo = useCallback(async () => {
        if (!details?.id) return;

        try {
            const imagesEndPoint = `${mediaType}/${details.id}/images`;
            const imagesResponse = await tmdbAxios.get(imagesEndPoint, {
                params: {
                    include_image_language: 'en,null'
                }
            });

            const logos = imagesResponse.data.logos;
            if (logos?.length > 0) {
                // Score and filter logos
                const scoredLogos = logos.map(logo => ({
                    ...logo,
                    score: (
                        (logo.iso_639_1 === 'en' ? 10 : 0) +
                        (logo.file_path.endsWith('.svg') ? 5 : 0) +
                        (logo.aspect_ratio > 1.5 ? 3 : 0)
                    )
                }));

                const sortedLogos = scoredLogos.sort((a, b) => b.score - a.score);
                const bestLogo = sortedLogos[0];
                
                if (bestLogo) {
                    setMovieTitle(`${baseImgUrl}${bestLogo.file_path}`);
                } else {
                    setMovieTitle('');
                }
            } else {
                setMovieTitle(posterUrl);
            }
        } catch (error) {
            console.error("Error fetching movie logo:", error);
            setMovieTitle(posterUrl);
        }
    }, [details?.id, mediaType, posterUrl, baseImgUrl]);

    // Effect for fetching content
    useEffect(() => {
        fetchTrailer();
        fetchMovieLogo();
    }, [details?.id, fetchTrailer, fetchMovieLogo]);

    // Auto-play effect
    useEffect(() => {
        const autoPlayTimer = setTimeout(() => {
            setIsPlaying(true);
        }, 2500);
        
        return () => clearTimeout(autoPlayTimer);
    }, []);

    // Handle click events
    const handleClick = useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    // Handle volume toggle
    const toggleVolume = useCallback((e) => {
        e.stopPropagation();
        setAudio(prev => prev === 0 ? 1 : 0);
    }, [])
    
    return (
        <div className="relative w-full aspect-video overflow-hidden min-h-[30vh] max-h-[80vh]">
            {/* Background image/video container */}
            <div className="absolute inset-0" onClick={handleClick}>
                <AnimatePresence initial={false}>
                    {(!isPlaying || !trailer) ? (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: imageLoaded ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={backdropUrl}
                                alt={details?.title || details?.name}
                                className="w-full h-full object-cover"
                                onLoad={() => setImageLoaded(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0"
                        >
                            <VideoPlayer
                                id={details?.id}
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                videoRef={videoRef}
                                mediaType={mediaType}
                                trailer={trailer}
                                setTrailer={setTrailer}
                                volume={audio}
                                videoProgress={videoProgress}
                                setVideoProgress={setVideoProgress}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Movie Title/Logo */}
            {movieTitle && (
                <motion.img
                    src={movieTitle}
                    alt={details?.title || details?.name}
                    className="absolute bottom-4 left-4 md:bottom-10 md:left-10 max-w-[100px] md:max-w-[400px] z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                />
            )}

            {/* Volume Control */}
            {trailer && (
                <motion.button
                    onClick={toggleVolume}
                    className="absolute bottom-12 right-1 md:bottom-10 md:right-24 z-20 p-2 w-fit rounded-full bg-transparent hover:text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <FontAwesomeIcon 
                        icon={audio === 0 ? faVolumeOff : faVolumeHigh}
                        className="text-white text-xl md:text-3xl "
                    />
                </motion.button>
            )}
            <div className="bg-black bg-opacity-25 bottom-3 right-0 md:bottom-11 border-white border-l-[5px] w-fit absolute pr-3 md:pr-12 px-2 py-2 rounded-lg z-30">
                <h1 className="text-white text-md md:text-lg font-semibold">{details?.adult ? '18+' : 'Any'}
                </h1>
            </div>
        </div>
    );
}
