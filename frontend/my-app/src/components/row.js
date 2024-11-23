import React from "react";
import { tmdbAxios } from "../axios";
import YouTube from "react-youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Row(props) {
    const [movies, setMovies] = React.useState([]);
    const [trailerUrl, setTrailerUrl] = React.useState('');
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const apikey = process.env.REACT_APP_API_KEY
    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 1,
    }}

    const navigate = useNavigate();
    const handleClick = (movie) => {
        navigate(`movie/${movie.id}`);
    };

    // src/components/row.js
React.useEffect(() => {
    const url = `${props.fetchUrl}`;
    const fetchData = async () => {
        try {
            const response = await tmdbAxios.get(url, {
                params: {
                    // Additional params for anime content
                    ...(url.includes('discover/tv') && {
                        with_genres: '16', // Anime genre ID in TMDB
                        with_keywords: '210024|6075', // Keywords for anime content
                        sort_by: 'popularity.desc'
                    })
                }
            });

            // Transform the data if it's anime content
            const results = response.data.results.map(item => ({
                ...item,
                // Use different property names for TV shows/anime
                title: item.title || item.name,
                backdrop_path: item.backdrop_path || item.poster_path,
                // Add a flag to identify anime content
                isAnime: url.includes('discover/tv')
            }));

            setMovies(results);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    fetchData();
}, [props.fetchUrl]);



    return (
        <div className="my-5 text-white">
            <h1 className="text-2xl mx-3 font-bold">{props.title}</h1>
            <div className="flex flex-row max-h-full max-w-full gap-5 px-3 overflow-x-scroll overflow-y-hidden py-3 hide-scrollbar mx-5" >
                {movies.map(movie => (
                    <div className="relative group cursor-pointer">
                        <img 
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            className="max-h-72 max-w-64 scale-95 hover:scale-100 transitionall duration-200 ease-in-out transform" 
                            src={`${baseImgUrl}${props.isBig ? movie.poster_path : movie.backdrop_path}`} 
                            alt={movie.title}
                            >
                        </img>
                        <div className="absolute bottom-0 scale-100 left-0 p-3 right-0 bg-gradient-to-t from-[#111] opacity-0 
                                        group-hover:opacity-100 transition-opacity duration-300">
                            <h2>{movie.title || movie.name}</h2>
                            <p className="text-gray-300 text-sm align-middle flex flex-row items-center gap-1">
                                <FontAwesomeIcon icon={faStar}/> {movie.vote_average.toFixed(1)}
                            </p>
                        </div>
                    </div>    
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}
