// src/components/BrowseContent.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { djangoAxios, tmdbAxios } from '../axios';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck, faStar } from "@fortawesome/free-solid-svg-icons";

export default function BrowseContent() {
    const navigate = useNavigate();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState('');
    const [addedItems, setAddedItems] = useState({});
    const { category } = useParams(); // 'movies', 'tvshows', etc.
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";

    // YouTube player options (reusing from your row.js)
    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 1,
        }
    };

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                let endpoint;
                switch (category) {
                    case 'movies':
                        endpoint = 'discover/movie';
                        break;
                    case 'tvshows':
                        endpoint = 'discover/tv';
                        break;
                    case 'trending':
                        endpoint = 'trending/all/week';
                        break;
                    default:
                        endpoint = 'discover/movie';
                }

                const response = await tmdbAxios.get(endpoint);
                setContent(response.data.results);
            } catch (error) {
                setError('Failed to fetch content');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [category]);

    const handleItemClick = (item) => {
        navigate(`movie/${item.id}`);
    };

    useEffect(() => {
        const fetchMyList = async () => {
            try {
                const response = await djangoAxios.get('mylist/');
                const myListItems = {};
                response.data.forEach(item => {
                    myListItems[item.movie_id] = true;
                });
                setAddedItems(myListItems);
            } catch (error) {
                console.error('Error fetching my list:', error);
            }
        };

        fetchMyList();
    }, []);

    const addToList = async (item) => {
        try {
            const movieData = {
                movie_id: item.id,
                title: item.title || item.name,
                poster_path: item.poster_path
            };

            await djangoAxios.post('mylist/add/', movieData);
            // Update local state to show check icon
            setAddedItems(prev => ({
                ...prev,
                [item.id]: true
            }));
        } catch (error) {
            if (error.response?.data?.non_field_errors?.[0].includes('unique set')) {
                alert('This movie is already in your list!');
            } else {
                console.error('Error adding to list:', error);
                alert('Failed to add to list');
            }
        }
    };


    if (loading) {
        return <div className="h-screen flex items-center justify-center">
            <div className="text-white text-2xl">Loading...</div>
        </div>;
    }

    if (error) {
        return <div className="h-screen flex items-center justify-center">
            <div className="text-white text-2xl">{error}</div>
        </div>;
    }

    return (
        <div className="pt-20 min-h-screen bg-black">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-white mb-8 capitalize">
                    {category || 'Movies'}
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {content.map((item) => (
                        <div 
                            key={item.id} 
                            className="relative group cursor-pointer"
                            onClick={() => handleItemClick(item)}
                        >
                            <img
                                src={`${baseImgUrl}${item.poster_path}`}
                                alt={item.title || item.name}
                                className="w-full rounded-lg scale-95 transition-transform duration-300 group-hover:scale-100"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-white text-lg font-semibold">
                                {item.title || item.name}
                            </h3>
                            <p className="text-gray-300 text-sm align-middle flex flex-row items-center gap-1">
                                <FontAwesomeIcon icon={faStar}/> {item.vote_average.toFixed(1)}
                            </p>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!addedItems[item.id]) {
                                        addToList(item);
                                    }
                                }}
                                className={`
                                    absolute right-3 bottom-72
                                    bg-black/50 hover:bg-black/75
                                    p-2 rounded-md
                                    transform transition-all duration-300
                                    opacity-0 group-hover:opacity-100
                                    ${addedItems[item.id] 
                                        ? 'cursor-default ring-2 ring-green-500 ring-opacity-50' 
                                        : 'cursor-pointer hover:scale-110 active:scale-95'
                                    }
                                `}
                            >
                                <FontAwesomeIcon 
                                    icon={addedItems[item.id] ? faCheck : faPlus} 
                                    className={`
                                        transition-all duration-300 ease-in-out
                                        text-lg
                                        ${addedItems[item.id]
                                            ? 'text-green-500'
                                            : 'text-white group-hover:text-white/90'
                                        }
                                    `}
                                />
                            </div>

                            </div>
                        </div>
                    ))}
                </div>
                {trailerUrl && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <div className="relative">
                            <button 
                                onClick={() => setTrailerUrl('')}
                                className="absolute -top-10 right-0 text-white bg-red-600 px-4 py-2 rounded"
                            >
                                Close
                            </button>
                            <YouTube videoId={trailerUrl} opts={opts} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
