// src/components/MovieDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbAxios } from '../axios';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movieDetails, setMovieDetails] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // YouTube player options
    const opts = {
    height: '500px',
    width: '100%',
    playerVars: {
        autoplay: 1,          // Auto-play the video
        controls: 0,          // Hide player controls
        modestbranding: 1,    // Minimal branding
        rel: 0,               // Disable related videos
        iv_load_policy: 3,    // Disable annotations
        fs: 0,                // Disable fullscreen button
        disablekb: 1,         // Disable keyboard shortcuts
    },
};


    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                // Fetch movie details
                const detailsResponse = await tmdbAxios.get(`/movie/${id}`);
                
                // Fetch videos (trailers)
                const videoResponse = await tmdbAxios.get(`/movie/${id}/videos`);
                
                // Find official trailer
                const trailer = videoResponse.data.results.find(
                    video => video.type === "Trailer" && video.site === "YouTube"
                );

                setMovieDetails(detailsResponse.data);
                if (trailer) {
                    setTrailerUrl(trailer.key);
                }
            } catch (err) {
                setError("Failed to fetch movie details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    if (error || !movieDetails) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="text-white text-2xl">{error || "Movie not found"}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 flex flex-col gap-32">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 max-w-fit text-white px-2 py-1 rounded-full hover:bg-gray-800 transition-colors z-50"
            >
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>

            {/* Trailer/Backdrop Section */}
            <div className="relative w-full h-[600px]">
                {trailerUrl ? (
                    <YouTube videoId={trailerUrl} opts={opts} className="w-full" />
                ) : (
                    <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`
                        }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    </div>
                )}
            </div>

            {/* Movie Details Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="w-full md:w-1/3">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                            alt={movieDetails.title}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Details */}
                    <div className="w-full md:w-2/3">
                        <h1 className="text-4xl font-bold mb-4">{movieDetails.title}</h1>
                        
                        {/* Release Date & Runtime */}
                        <div className="flex items-center gap-4 text-gray-300 mb-4">
                            <span>{new Date(movieDetails.release_date).getFullYear()}</span>
                            <span>•</span>
                            <span>{Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m</span>
                            <span>•</span>
                            <span>{movieDetails.vote_average.toFixed(1)} ⭐</span>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movieDetails.genres.map(genre => (
                                <span 
                                    key={genre.id}
                                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        {/* Overview */}
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            {movieDetails.overview}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors">
                                <FontAwesomeIcon icon={faPlay} />
                                <span>Play</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                                <FontAwesomeIcon icon={faPlus} />
                                <span>My List</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}