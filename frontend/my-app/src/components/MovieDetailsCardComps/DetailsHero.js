import React, { useState, useEffect, useRef } from "react";
import VideoPlayer from "../VideoPlayer";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeOff } from "@fortawesome/free-solid-svg-icons";
import { tmdbAxios } from "../../axios";

export default function DetailsHero({ details, mediaType, isFullPage }) {
    const [trailer, setTrailer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(1);
    const [movieTitle, setMovieTitle] = useState(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const videoRef = useRef(null);
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const backdropUrl = `${baseImgUrl}${details?.backdrop_path}`;
    const posterUrl = `${baseImgUrl}${details?.poster_path}`;
    const API_KEY = process.env.REACT_APP_API_KEY;

    useEffect(() => {
    async function fetchTrailer() {
        try {
            // First try to fetch videos from TMDB
            const tmdbEndpoint = mediaType === "movie" ? 
                `movie/${details.id}/videos` : 
                `tv/${details.id}/videos`;
            
            const response = await tmdbAxios.get(tmdbEndpoint, {
                params: {
                    api_key: API_KEY,
                }
            });

            const videos = response.data.results || [];

            // Define priority criteria for different types of videos
            const trailerPriorities = [
                // Priority 1: Official English Trailer/Teaser from verified sources
                video => ({
                    score: 100,
                    match: video.type?.toLowerCase().includes('trailer') &&
                           video.official === true &&
                           (video.iso_639_1 === 'en' || !video.iso_639_1) &&
                           video.site === 'YouTube' &&
                           video.key
                }),

                // Priority 2: Official Trailer/Teaser (any language) from verified sources
                video => ({
                    score: 80,
                    match: video.type?.toLowerCase().includes('trailer') &&
                           video.official === true &&
                           video.site === 'YouTube' &&
                           video.key
                }),

                // Priority 3: English Teasers/Clips from verified sources
                video => ({
                    score: 60,
                    match: (video.type?.toLowerCase().includes('teaser') || 
                           video.type?.toLowerCase().includes('clip')) &&
                           (video.iso_639_1 === 'en' || !video.iso_639_1) &&
                           video.site === 'YouTube' &&
                           video.key
                }),

                // Priority 4: Any official video content
                video => ({
                    score: 40,
                    match: video.official === true &&
                           video.site === 'YouTube' &&
                           video.key
                }),

                // Priority 5: Any video content from YouTube
                video => ({
                    score: 20,
                    match: video.site === 'YouTube' && video.key
                })
            ];

            // Score and sort all videos
            const scoredVideos = videos.map(video => {
                let maxScore = 0;
                for (let priority of trailerPriorities) {
                    const result = priority(video);
                    if (result.match && result.score > maxScore) {
                        maxScore = result.score;
                    }
                }
                return { ...video, score: maxScore };
            });

            // Sort by score and additional criteria
            const sortedVideos = scoredVideos
                .filter(video => video.score > 0)
                .sort((a, b) => {
                    // Primary sort by score
                    if (b.score !== a.score) return b.score - a.score;
                    
                    // Secondary sort by publish date if available
                    if (a.published_at && b.published_at) {
                        return new Date(b.published_at) - new Date(a.published_at);
                    }
                    
                    // Tertiary sort by vote count
                    return (b.vote_count || 0) - (a.vote_count || 0);
                });

            if (sortedVideos.length > 0) {
                setTrailer(sortedVideos[0]);
            } else {
                // If no videos found on TMDB, try fallback search
                const fallbackSearch = await tmdbAxios.get(`search/${mediaType}`, {
                    params: {
                        api_key: API_KEY,
                        query: details.title || details.name,
                        year: new Date(details.release_date || details.first_air_date).getFullYear()
                    }
                });

                const alternativeId = fallbackSearch.data.results?.[0]?.id;
                if (alternativeId && alternativeId !== details.id) {
                    const alternativeVideos = await tmdbAxios.get(`${mediaType}/${alternativeId}/videos`, {
                        params: {
                            api_key: API_KEY,
                            language: 'en-US'
                        }
                    });

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
            setTrailer(null);
        }
    }

    if (details?.id) {
        fetchTrailer();
    }
}, [details?.id, mediaType, API_KEY]);


    useEffect(() => {
        async function fetchMovieLogo() {
            try {
                const imagesEndPoint = mediaType === "movie" ? `movie/${details.id}/images` : `tv/${details.id}/images`;
                
                const imagesResponse = await tmdbAxios.get(imagesEndPoint, {
                    params: {
                        api_key: API_KEY,
                        include_image_language: 'en,null'
                    }
                });

                const logos = imagesResponse.data.logos;
                if (logos && logos.length > 0) {
                    const filteredLogos = logos
                        .filter(logo => logo.aspect_ratio >= 1.5 && logo.aspect_ratio <= 4)
                        .filter(logo => logo.width >= 400 && logo.height >= 100)
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
                        const fallbackLogo = `https://image.tmdb.org/t/p/w500/${details?.poster_path}`;
                        setMovieTitle(fallbackLogo);
                    }
                } else {
                    const fallbackLogo = `https://image.tmdb.org/t/p/w500/${details?.poster_path}`;
                    setMovieTitle(fallbackLogo);
                }
            } catch (error) {
                console.error("Error fetching movie logo:", error);
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

    useEffect(() => {
        setVideoProgress(0);
        setIsPlaying(false);

        return () => {
            setVideoProgress(0);
        };
    }, [trailer]);


    const handleClick = () => {
        setIsPlaying(prev => !prev);
    };

    return (
        <div className={`relative w-[100%] overflow-hidden ${
            isFullPage 
                ? "h-[30vh] md:h-[70vh] lg:h-[80vh]" 
                : "h-[30vh] md:h-[40vh] lg:h-[50vh]"
        }`}>
            <AnimatePresence initial={false}>
                {!isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="relative h-full w-full overflow-hidden bg-cover"
                        style={{ 
                            backgroundImage: `url(${ 
                                window.innerWidth < 768 
                                    ? posterUrl 
                                    : backdropUrl
                            })`,
                            backgroundPosition: window.innerWidth < 768 ? 'center' : '50% 35%'
                        }}
                        onClick={handleClick}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                        {window.innerWidth >= 768 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
                        )}
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
                        className={`h-full w-full overflow-hidden ${
                            isFullPage 
                                ? 'scale-100' 
                                : 'lg:scale-[1.2] xl:scale-[1.1]'
                        }`}
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
                            videoProgress={videoProgress}
                            setVideoProgress={setVideoProgress}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {movieTitle && (
                <div className={`absolute ${
                    isFullPage 
                        ? 'bottom-8 left-6 md:bottom-12 md:left-10 lg:bottom-16 lg:left-14'
                        : 'bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8'
                    } w-[130px] md:w-[160px] lg:w-[200px] max-w-[220px]`}>
                    <img 
                        src={movieTitle} 
                        alt="Movie Logo"
                        className="w-full h-auto object-contain"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Volume Control Button */}
            <div className={`absolute flex flex-row items-center justify-between gap-3 ${
                isFullPage 
                    ? 'bottom-5 right-0 lg:bottom-16'
                    : 'bottom-4 right-0 lg:bottom-8'
                } z-10`}>
                <FontAwesomeIcon 
                    icon={audio ? faVolumeHigh : faVolumeOff} 
                    onClick={() => setAudio(prev => !prev)}
                    className="text-xl md:text-2xl lg:text-3xl cursor-pointer 
                             transition-all duration-300 hover:scale-110
                             text-white hover:text-red-600"
                />
                {/* Age Rating Badge */}
                <div className={`right-0 bg-black/40 backdrop-blur-sm border-l-4 border-white
                    px-3 py-2 rounded-l-lg transition-all duration-300 hover:bg-black/60`}
                >
                <h1 className="text-base md:text-lg font-semibold">
                    {details?.adult ? '18+' : 'Any'}
                </h1>
            </div>
            </div>
        </div>
    );
}