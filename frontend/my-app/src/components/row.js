import React from "react";
import { tmdbAxios } from "../axios";
import YouTube from "react-youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ShimmerRow from "./shimmerComps/shimmerRow"
import DelayedRender from "./DelayRender";

export default function Row(props) {
    const [movies, setMovies] = React.useState([]);
    const [trailerUrl, setTrailerUrl] = React.useState('');
    const [loading, setLoading] = React.useState(true);
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

    const fetchAnimeContent = async (url, tmdbAxios) => {
        const response = await tmdbAxios.get(url, {
            params: {
                with_genres: '16',
                with_keywords: '210024|6075|287501',
                sort_by: 'vote_average.desc,popularity.desc',
                with_original_language: 'ja',
                without_genres: '10762',
                adult: false
            }
        });

        return response.data.results.map(item => ({
            ...item,
            title: item.name,
            original_title: item.original_title,
            media_type: 'anime',
            rating: item.vote_average,
            popularity_score: item.popularity
        }));
    };

    const fetchTvShowContent = async (url, tmdbAxios) => {
        const response = await tmdbAxios.get(url, {
            params: {
                sort_by: 'popularity.desc',
                'vote_count.gte': 50,
                without_genres: '16',
                without_keywords: '210024|6075|287501',
                adult: false
            }
        });
        return response.data.results.map(item => ({
            ...item,
            title: item.name,
            original_title: item.original_title,
            media_type: 'tv'
        }));
    };

    const fetchMovieContent = async (url, tmdbAxios) => {
        const response = await tmdbAxios.get(url, {
            params: {
                sort_by: 'popularity.desc',
                'vote_count.gte': 100,
                adult: true
            }
        });
        return response.data.results.map(item => ({
            ...item,
            media_type: 'movie'
        }));
    };

    const fetchGeneralContent = async (url, tmdbAxios) => {
        const response = await tmdbAxios.get(url);
        return response.data.results;
    }

    React.useEffect(() => {
        const url = `${props.fetchUrl}`;
        const fetchData = async () => {
            setLoading(true);
            try {
                let results;
                if (props.media_type === 'Anime') {
                    results = await fetchAnimeContent(url, tmdbAxios);
                } else if (props.media_type === 'TV') {
                    results = await fetchTvShowContent(url, tmdbAxios);
                } else if (props.media_type === 'Movie') {
                    results = await fetchMovieContent(url, tmdbAxios);
                } else {
                    results = await fetchGeneralContent(url, tmdbAxios);
                }
                setMovies(results);
            } catch (error) {
                console.error("Error fetching content: ", error);
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, [props.fetchUrl, props.media_type]);

    if (loading) {
    return (
        <ShimmerRow />
    )
}
   

    return (
        <div className="my-5 text-white">
            <h1 className="text-2xl mx-3 font-bold">{props.title}</h1>
            <DelayedRender delay={300} >
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
            </DelayedRender>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}
