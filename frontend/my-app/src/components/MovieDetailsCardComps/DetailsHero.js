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
    const [videoProgress, setVideoProgress] = useState(0);
    const videoRef = useRef(null);
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const imageUrl = `${baseImgUrl}${details?.backdrop_path}`;
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
                        <motion.div 
                            className="absolute inset-0 bg-black opacity-30" 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 0.3 }} 
                            exit={{ opacity: 0 }} 
                            transition={{ duration: 1 }} 
                        />
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
                        className="h-full lg:h-[400px] w-full overflow-hidden"
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
                <div className="absolute bottom-4 left-3 lg:bottom-10 lg:left-7 w-[90px] md:w-[130px]  max-w-[175px]">
                    <img 
                        src={movieTitle} 
                        alt="Movie Logo"
                        className="w-full h-auto object-contain"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Volume Control Button */}
            <div className="absolute bottom-[16px] right-[100px] lg:bottom-[40px] lg:right-[100px] z-10">
                <FontAwesomeIcon 
                    icon={audio ? faVolumeHigh : faVolumeOff} 
                    onClick={() => setAudio(prev => !prev)}
                    className="text-2xl cursor-pointer transition-transform transform hover:scale-110"
                />
            </div>
            <div className="bg-black bg-opacity-25 border-white border-l-[5px] w-fit right-0 top-[75%] md:top-[82%] lg:top-[79%] absolute pr-12 px-2 py-2 rounded-lg">
                <h1 className="text-lg font-semibold">{details?.adult ? '18+' : 'Any'}</h1>
            </div>
        </div>
    );
}