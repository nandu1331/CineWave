// src/components/MyList.js
import React, { useState, useEffect } from 'react';
import { djangoAxios } from '../axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

export default function MyList() {
    const [myList, setMyList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyList();
    }, []);

    const fetchMyList = async () => {
        try {
            const response = await djangoAxios.get('mylist/');
            setMyList(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching mylist:', error);
            setError('Failed to fetch your list');
            setLoading(false);
        }
    };

    const handleClick = (movieId) => {
        navigate(`movie/${movieId}`)
    } 

    const removeFromList = async (movieId) => {
        try {
            await djangoAxios.delete(`mylist/remove/${movieId}/`);
            // Remove movie from state
            setMyList(myList.filter(movie => movie.movie_id !== movieId));
        } catch (error) {
            console.error('Error removing movie from list:', error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-white">{error}</div>;

    return (
        <div className="container mx-auto px-4 pt-24 min-h-screen">
            <h1 className="text-white text-3xl font-bold mb-8">My List</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10">
                {myList.map(movie => (
                    <div 
                        key={movie.movie_id} 
                        onClick={() => handleClick(movie.movie_id)}
                        className='relative group cursor-pointer'    
                    >
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFromList(movie.movie_id);
                            }}
                            className={`
                                absolute z-50 right-2 top-2
                                bg-black/50 hover:bg-black/75
                                p-2 rounded-md
                                transform transition-all duration-300
                                opacity-0 group-hover:opacity-100
                                'cursor-default ring-2 ring-red-500 ring-opacity-50'
                            `} 
                        >
                            <FontAwesomeIcon 
                                icon={faMinus} 
                                className={`
                                    transition-all duration-300 ease-in-out
                                    text-lg
                                    text-red-500
                                `}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
