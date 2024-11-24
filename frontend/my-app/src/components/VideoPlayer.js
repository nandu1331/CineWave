import axios from "axios";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { tmdbAxios } from "../axios";

export default function VideoPlayer({
    id,
    isPlaying,
    setIsPlaying,
    videoRef,
    setMovieTitle,
    mediaType,
    trailer,
    setTrailer
}) {
    const [videoProgress, setVideoProgress] = useState(0);
    const API_KEY = process.env.REACT_APP_API_KEY;

    // In VideoPlayer.js
    useEffect(() => {
        async function fetchTrailerAndLogo() {
            try {
                const endpoint = mediaType === "Movie" ? 
                    `movie/${id}/videos` : 
                    `tv/${id}/videos`;
                
                const response = await tmdbAxios.get(endpoint);
                const data = response.data;
            
                const officialTrailer = data.results?.find(
                    (video) =>
                        video.type === 'Trailer' &&
                        video.site === 'YouTube'
                );

                if (officialTrailer) {
                    setTrailer(officialTrailer);
                }

                const imagesEndPoint = mediaType === "Movie" ?
                    `movie/${id}/images` :
                    `tv/${id}/images`;
                
                const imagesResponse = await tmdbAxios.get(imagesEndPoint, {
                    params: {
                        api_key: API_KEY,
                        include_image_language: 'en,null'
                    }
                })
                const logos = imagesResponse.data.logos;
                if (logos && logos.length > 0) {
                    const filteredLogos = logos
                        .filter(logo => {
                            const aspectRatio = logo.aspect_ratio;
                            return aspectRatio >= 1.5 && aspectRatio <= 4; // reasonable aspect ratio range
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
                        setMovieTitle(null);
                    }
                } else {
                    setMovieTitle(null);
                }

            } catch (error) {
                setMovieTitle(null);
            }
        }
        if (id) {
            fetchTrailerAndLogo();
        }

        return () => {
            setMovieTitle(null);
        };
    }, [id, mediaType, API_KEY, setMovieTitle, setTrailer]);

        

    const handleVideoReady = () => {
        if (videoRef.current) {
            videoRef.current.seekTo(videoProgress, "seconds");
        }
    };

    const progressHandler = (progress) => {
        setVideoProgress(progress.playedSeconds);
        if (progress.played >= 0.85) {
            setIsPlaying(false);
            if (videoRef.current) {
                videoRef.current.seekTo(2, "seconds");
            }
        }
    };

    return (
        <div className="h-full w-full relative overflow-hidden">
            {trailer && 
                <div className="absolute inset-0 scale-[1.35]">
                    <ReactPlayer
                        ref={videoRef}
                        url={`https://www.youtube.com/watch?v=${trailer.key}`}
                        playing={isPlaying}
                        controls={false}
                        height="100%"
                        width="100%"
                        onReady={handleVideoReady}
                        onPause={() => setIsPlaying(false)}
                        progressInterval={1000}
                        onProgress={progressHandler}
                    />
                </div>
        }
        </div>
    )
}